import {prisma} from '../../prisma';
import { TeacherWithLoad, Classroom, Subject, SchedulePlan, ScheduledLesson, SchedulingContext } from "../../types";
import { allSubjects, branchMap, gradeSpecificSubjects, MAX_HOURS_PER_TEACHER } from "../../data/subjects";
import { Grades } from "../../../generated/prisma/enums";
import { commitSlots, findAvailableSlots, uncommitSlots } from './findAvailableSlots';

const solve = (
  subjectIndex: number,
  scheduleId: string,
  context: SchedulingContext,
  classrooms: Classroom[],
  lessons: ScheduledLesson[],
  subjectsToSchedule: Subject[],
):boolean => {

  if (subjectIndex === subjectsToSchedule.length) return true;

  const subject = subjectsToSchedule[subjectIndex];
  const branch = branchMap[subject.name];
  const relevantClassrooms = getRelevantClassrooms(subject, classrooms);
  const eligibleTeachers = getEligibleTeachers(context.teachers, branch);
 
  for(const classroom of relevantClassrooms){
    for(const teacher of eligibleTeachers){
      if(!isTeacherEligible(teacher, subject)) continue;

      const slots = findAvailableSlots(
        teacher.id,
        classroom.id,
        context,
        subject
      );

      const previousGrade = teacher.grade;

      if(slots){
        commitSlots(slots, teacher.id, classroom.id, context.teacherSlots, context.classSlots);
        teacher.assignedHours += subject.hours;
        updateTeacherGradeIfNeeded(teacher, subject);

        const addedLessons = slots.map(s => ({branch, teacher_id: teacher.id, class_id: classroom.id,scheduleId, ...s }));
        lessons.push(...addedLessons);

        if (solve(subjectIndex + 1, scheduleId, context, classrooms, lessons, subjectsToSchedule)) {
          return true;
        }

        teacher.assignedHours -= subject.hours;
        teacher.grade = previousGrade;
        uncommitSlots(slots, teacher.id, classroom.id, context.teacherSlots, context.classSlots);
        for(const _ of slots) lessons.pop();
      }
    }
  }
  return false;
}

export const buildSchedule = async (scheduleId: string) => {
  const {teachers, classrooms } = await loadRequiredData(scheduleId);
  const context = createSchedulingContext(teachers);
  const lessons: ScheduledLesson[] = [];

  const sortedSubjects = [...allSubjects].sort((a, b) => b.hours - a.hours);

  const success = solve(0, scheduleId, context, classrooms, lessons, sortedSubjects);

  if(success) {
    const teacherHourUpdates = context.teachers.map(t => ({
    id: t.id,
    hours: t.assignedHours,
    grade: t.grade,
  }));
    await persistSchedule({lessons, teacherHourUpdates});
    return {result: true};
  }
  return {result: false};
}

const updateTeacherGradeIfNeeded = (
  teacher: TeacherWithLoad,
  subject: Subject
) => {
  if (!gradeSpecificSubjects.some(s => s.name === subject.name)) return;

  const subjectGrade =
    subject.grade === 'elementary'
      ? Grades.ELEMENTARY
      : Grades.MIDDLE_HIGH;

  if (!teacher.grade) {
    teacher.grade = subjectGrade;
  }
};

const isTeacherEligible = (t: TeacherWithLoad, subject: Subject) => {
  const canTeachFor = MAX_HOURS_PER_TEACHER - t.assignedHours;
  if (canTeachFor < subject.hours) return false;

  if (gradeSpecificSubjects.some(s => s.name === subject.name)) {
    const subjectGrade =
      subject.grade === 'elementary'
        ? Grades.ELEMENTARY
        : Grades.MIDDLE_HIGH;

    if (t.grade !== null && t.grade !== subjectGrade) {
      return false;
    }
  }
  return true;
};

const getRelevantClassrooms = (
  subject: Subject,
  classrooms: Classroom[]
) => {
  if (!gradeSpecificSubjects.includes(subject)) {
    return classrooms;
  }

  const subjectGrade =
    subject.grade === 'elementary'
      ? Grades.ELEMENTARY
      : Grades.MIDDLE_HIGH;
  return classrooms.filter(c => c.grade === subjectGrade);
};

const getEligibleTeachers = (
  teachers: TeacherWithLoad[],
  branch: string
) => {
  return teachers.filter(t => t.branch === branch);
};

const loadRequiredData = async (scheduleId: string) => {
  const [classrooms, rawTeachers] = await Promise.all([
    prisma.classroom.findMany({ where: { scheduleId } }),
    prisma.teacher.findMany({ where: { scheduleId } }),
  ]);

  if (!classrooms.length) throw new Error(`No classrooms found for schedule ${scheduleId}`);
  if (!rawTeachers.length) throw new Error(`No teachers found for schedule ${scheduleId}`);

  const teachers: TeacherWithLoad[] = rawTeachers.map(t => ({
    ...t,
    assignedHours: 0,
    grade: null,
  }));

  return { classrooms, teachers };
};

const persistSchedule = async (plan: SchedulePlan) => {
  await prisma.$transaction(async (tx) => {
    await tx.lesson.createMany({ data: plan.lessons });

    await Promise.all(
      plan.teacherHourUpdates.map(({ id, hours, grade }) =>
        tx.teacher.update({
          where: { id },
          data: { hours, grade },
        },)
      )
    );
  }, {timeout: 10000});
};

const createSchedulingContext = (teachers: TeacherWithLoad[]): SchedulingContext => {
  return {
    teacherSlots: new Set<string>(),
    classSlots: new Set<string>(),
    teachers,
  };
};


