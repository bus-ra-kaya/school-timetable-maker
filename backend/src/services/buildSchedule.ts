import { Grades } from "../generated/prisma/enums.js";
import { allSubjects, branchMap, gradeSpecificSubjects } from "../data/subjects.js";
import { prisma } from "../prisma.js";
import type {TeacherWithLoad, Classroom, ScheduledLesson, Subject, SchedulePlan } from "../types.js";
import { shuffleArray } from "../utils/shuffleArray.js";
import { commitSlots, findAvailableSlots } from "./findAvailableSlots.js";

type SolverResult = {
  lessons: ScheduledLesson[];
  teachers: TeacherWithLoad[];
  teacherSlots: Set<string>;
  classSlots: Set<string>;
};

const MAX_ATTEMPTS = 1000;

const buildBranchTeacherIndexMap = (teachers: TeacherWithLoad[]) => {
  const map = new Map<string, number[]>();

  teachers.forEach((t, i) => {
    const list = map.get(t.branch) ?? [];
    list.push(i);
    map.set(t.branch, list);
  });

  return map;
};

const solveYear = (
  yearIndex: number,
  allYears: Classroom[][],
  teachers: TeacherWithLoad[],
  teacherSlots: Set<string>,
  classSlots: Set<string>,
  scheduleId: string,
  maxHoursPerTeacher: number,
  branchTeacherMap: Map<string, number[]>
): SolverResult | null => {

  if (yearIndex >= allYears.length) {
    return { lessons: [], teachers, teacherSlots, classSlots };
  }

  if (!allYears[yearIndex]) return null;

  const yearClassrooms = [...allYears[yearIndex]].sort(() => Math.random() - 0.5);

  const yearResult = solveClassroomList(
    0,
    yearClassrooms,
    teachers,
    teacherSlots,
    classSlots,
    scheduleId,
    maxHoursPerTeacher,
    branchTeacherMap
  );

  if (!yearResult) {
    return null;
  }

  const nextYearResult = solveYear(
    yearIndex + 1,
    allYears,
    yearResult.teachers,
    yearResult.teacherSlots,
    yearResult.classSlots,
    scheduleId,
    maxHoursPerTeacher,
    branchTeacherMap
  );

  if (!nextYearResult) return null;

  return {
    lessons: [...yearResult.lessons, ...nextYearResult.lessons],
    teachers: nextYearResult.teachers,
    teacherSlots: nextYearResult.teacherSlots,
    classSlots: nextYearResult.classSlots
  };
};

const solveClassroomList = (
  classIndex: number,
  classrooms: Classroom[],
  teachers: TeacherWithLoad[],
  teacherSlots: Set<string>,
  classSlots: Set<string>,
  scheduleId: string,
  maxHoursPerTeacher: number,
  branchTeacherMap: Map<string, number[]>
): SolverResult | null => {

  if (classIndex >= classrooms.length) {
    return { lessons: [], teachers, teacherSlots, classSlots };
  }

  const classroom = classrooms[classIndex];
  if (!classroom) return null;

  const grade = classroom.year <= 4 ? "elementary" : "middle/high";
  const subjects = allSubjects.filter(s => s.grade === grade);

  const subjectsResult = solveSubjectsForClass(
    0,
    subjects,
    classroom,
    teachers,
    teacherSlots,
    classSlots,
    scheduleId,
    maxHoursPerTeacher,
    branchTeacherMap
  );

  if (!subjectsResult) return null;

  const nextClassResult = solveClassroomList(
    classIndex + 1,
    classrooms,
    subjectsResult.teachers,
    subjectsResult.teacherSlots,
    subjectsResult.classSlots,
    scheduleId,
    maxHoursPerTeacher,
    branchTeacherMap
  );

  if (!nextClassResult) return null;

  return {
    lessons: [...subjectsResult.lessons, ...nextClassResult.lessons],
    teachers: nextClassResult.teachers,
    teacherSlots: nextClassResult.teacherSlots,
    classSlots: nextClassResult.classSlots
  };
};

const solveSubjectsForClass = (
  subjectIndex: number,
  subjects: Subject[],
  classroom: Classroom,
  currentTeachers: TeacherWithLoad[],
  currentTeacherSlots: Set<string>,
  currentClassSlots: Set<string>,
  scheduleId: string,
  maxHoursPerTeacher: number,
  branchTeacherMap: Map<string, number[]>
): SolverResult | null => {

  if (subjectIndex >= subjects.length) {
    return {
      lessons: [],
      teachers: currentTeachers,
      teacherSlots: currentTeacherSlots,
      classSlots: currentClassSlots
    };
  }

  const subject = subjects[subjectIndex];
  if (!subject) return null;

  const branch = branchMap[subject.name];
  if (!branch) return null;

  const indices = branchTeacherMap.get(branch) ?? [];
  const shuffledIndices = shuffleArray(indices);

  for (const idx of shuffledIndices) {
    const teacher = currentTeachers[idx];
    if (!teacher || !isTeacherEligible(teacher, subject, maxHoursPerTeacher)) continue;

    const slots = findAvailableSlots(
      teacher.id,
      classroom.id,
      {
        teacherSlots: currentTeacherSlots,
        classSlots: currentClassSlots,
        teachers: currentTeachers
      },
      subject
    );

    if (slots) {
      const nextTeacherSlots = new Set(currentTeacherSlots);
      const nextClassSlots = new Set(currentClassSlots);

      commitSlots(slots, teacher.id, classroom.id, nextTeacherSlots, nextClassSlots);

      const updatedTeachers = [...currentTeachers];
      const current = updatedTeachers[idx];
      if (!current) continue;

      updatedTeachers[idx] = {
        ...current,
        assignedHours: current.assignedHours + subject.hours,
        grade: getNewGrade(current, subject)
      };

      const addedLessons = slots.map(s => ({
        branch,
        teacher_id: teacher.id,
        class_id: classroom.id,
        scheduleId,
        ...s
      }));

      const result = solveSubjectsForClass(
        subjectIndex + 1,
        subjects,
        classroom,
        updatedTeachers,
        nextTeacherSlots,
        nextClassSlots,
        scheduleId,
        maxHoursPerTeacher,
        branchTeacherMap
      );

      if (result) {
        return {
          ...result,
          lessons: [...addedLessons, ...result.lessons]
        };
      }
    }
  }

  return null;
};

const getNewGrade = (teacher: TeacherWithLoad, subject: Subject) => {
  if (!gradeSpecificSubjects.some(s => s.name === subject.name)) return teacher.grade;
  if (teacher.grade !== null) return teacher.grade;

  return subject.grade === "elementary"
    ? Grades.ELEMENTARY
    : Grades.MIDDLE_HIGH;
};

const isTeacherEligible = (
  teacher: TeacherWithLoad,
  subject: Subject,
  maxHoursPerTeacher: number
) => {
  const canTeachFor = maxHoursPerTeacher - teacher.assignedHours;
  if (canTeachFor < subject.hours) return false;

  if (gradeSpecificSubjects.some(s => s.name === subject.name)) {
    const subjectGrade =
      subject.grade === "elementary"
        ? Grades.ELEMENTARY
        : Grades.MIDDLE_HIGH;

    if (teacher.grade !== null && teacher.grade !== subjectGrade) return false;
  }

  return true;
};

const loadRequiredData = async (scheduleId: string) => {
  const [classrooms, rawTeachers] = await Promise.all([
    prisma.classroom.findMany({ where: { scheduleId } }),
    prisma.teacher.findMany({ where: { scheduleId } })
  ]);

  if (!classrooms.length) {
    throw new Error(`No classrooms found for schedule ${scheduleId}`);
  }

  if (!rawTeachers.length) {
    throw new Error(`No teachers found for schedule ${scheduleId}`);
  }

  const teachers: TeacherWithLoad[] = rawTeachers.map(t => ({
    ...t,
    assignedHours: 0,
    grade: null
  }));

  return { classrooms, teachers };
};

const persistSchedule = async (plan: SchedulePlan) => {
  await prisma.$transaction(
    async tx => {
      await tx.lesson.createMany({ data: plan.lessons });

      await Promise.all(
        plan.teacherHourUpdates.map(({ id, hours, grade }) =>
          tx.teacher.update({
            where: { id },
            data: { hours, grade }
          })
        )
      );
    },
    { timeout: 20000 }
  );
};

export const buildSchedule = async (
  scheduleId: string,
  maxHoursPerTeacher: number
) => {

  const { classrooms: rawClassrooms, teachers: rawTeachers } =
    await loadRequiredData(scheduleId);

  const map = new Map<number, Classroom[]>();
  for (const c of rawClassrooms) {
    if (!map.has(c.year)) map.set(c.year, []);
    map.get(c.year)!.push(c);
  }

  const groupedClassrooms = Array.from(map.values());

  let attempts = 0;

  while (attempts < MAX_ATTEMPTS) {
    const classrooms = shuffleArray(groupedClassrooms);
    const teachers = shuffleArray(rawTeachers);

    const branchTeacherMap = buildBranchTeacherIndexMap(teachers);

    const result = solveYear(
      0,
      classrooms,
      teachers,
      new Set(),
      new Set(),
      scheduleId,
      maxHoursPerTeacher,
      branchTeacherMap
    );

    if (result) {
      await persistSchedule({
        lessons: result.lessons,
        teacherHourUpdates: result.teachers.map(t => ({
          id: t.id,
          hours: t.assignedHours,
          grade: t.grade
        }))
      });

      return { result: true };
    }

    attempts++;
  }
  return { result: false };
};