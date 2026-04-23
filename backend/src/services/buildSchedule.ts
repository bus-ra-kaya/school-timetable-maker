import { Grades } from "../generated/prisma/enums.js";
import { allSubjects, branchMap, gradeSpecificSubjects, MAX_HOURS_PER_TEACHER } from "../data/subjects.js";
import { prisma } from "../prisma.js";
import type { TeacherWithLoad, Classroom, ScheduledLesson, Subject, SchedulePlan } from "../types.js";
import { shuffleArray } from "../utils/shuffleArray.js";
import { commitSlots, findAvailableSlots } from "./findAvailableSlots.js";

type SolverResult = {
  lessons: ScheduledLesson[];
  teachers: TeacherWithLoad[];
  teacherSlots: Set<string>;
  classSlots: Set<string>;
}

const solveYear = (
  yearIndex: number,
  allYears: Classroom[][],
  teachers: TeacherWithLoad[],
  teacherSlots: Set<string>,
  classSlots: Set<string>,
  scheduleId: string
):SolverResult | null => {

  if(yearIndex >= allYears.length) return {lessons: [], teachers, teacherSlots, classSlots};
  
  if(!allYears[yearIndex]) return null;

  console.log(`--- Processing Year Group: ${allYears[yearIndex][0]?.year} ---`);
  const yearResult = solveClassroomList(
    0,
    allYears[yearIndex],
    teachers, 
    teacherSlots, 
    classSlots,
    scheduleId
  );

  if(!yearResult) return null;

  const nextYearResult = solveYear(
    yearIndex +1,
    allYears,
    yearResult.teachers,
    yearResult.teacherSlots,
    yearResult.classSlots,
    scheduleId
  );
  
  if(!nextYearResult) return null;

  return{
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
): SolverResult | null => {
  if (classIndex >= classrooms.length) {
    return { lessons: [], teachers, teacherSlots, classSlots };
  }

  const classroom = classrooms[classIndex];
  if(!classroom) return null;

  const grade = classroom.year <= 4 ? 'elementary' : 'middle/high';
  const subjects = allSubjects.filter(s => s.grade === grade);

  const subjectsResult = solveSubjectsForClass(
    0, 
    subjects, 
    classroom, 
    teachers, 
    teacherSlots, 
    classSlots, 
    scheduleId
  );

  if (!subjectsResult) return null;

  const nextClassResult = solveClassroomList(
    classIndex + 1,
    classrooms,
    subjectsResult.teachers,
    subjectsResult.teacherSlots,
    subjectsResult.classSlots,
    scheduleId
  );

  if (!nextClassResult) return null;

  return {
    lessons: [...subjectsResult.lessons, ...nextClassResult.lessons],
    teachers: nextClassResult.teachers,
    teacherSlots: nextClassResult.teacherSlots,
    classSlots: nextClassResult.classSlots
  };
}

const solveSubjectsForClass = (
  subjectIndex: number,
  subjects: Subject[],
  classroom: Classroom,
  currentTeachers: TeacherWithLoad[],
  currentTeacherSlots: Set<string>,
  currentClassSlots: Set<string>,
  scheduleId: string
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
  
  if(!subject){
    console.warn(`${subject} is not a valid subject!`);
    return null;
  }
  const branch = branchMap[subject.name];

  if(!branch){
    console.warn(`${branch} is not a valid branch!`);
    return null;
  }
  const branchTeachers = getBranchTeachers(currentTeachers, branch);

  for (const teacher of branchTeachers) {
    if (!teacher || !isTeacherEligible(teacher, subject)) continue;

    const slots = findAvailableSlots(teacher.id, classroom.id, {
      teacherSlots: currentTeacherSlots,
      classSlots: currentClassSlots,
      teachers: currentTeachers
    }, subject);

    if (slots) {
      const nextTeacherSlots = new Set(currentTeacherSlots);
      const nextClassSlots = new Set(currentClassSlots);
      
      commitSlots(slots, teacher.id, classroom.id, nextTeacherSlots, nextClassSlots);

      const index = currentTeachers.findIndex(t => t.id === teacher.id);

      const updatedTeachers = [...currentTeachers];
      if(!updatedTeachers) return null;
      if(!updatedTeachers[index]) return null;

      updatedTeachers[index] = {
        ...updatedTeachers[index],
        assignedHours: updatedTeachers[index].assignedHours + subject.hours,
        grade: getNewGrade(updatedTeachers[index], subject),
      };

      const addedLessons = slots.map(s => ({
        branch, teacher_id: teacher.id, class_id: classroom.id, scheduleId, ...s
      }));

      const result = solveSubjectsForClass(
        subjectIndex + 1,
        subjects,
        classroom,
        updatedTeachers,
        nextTeacherSlots,
        nextClassSlots,
        scheduleId
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
  if(teacher.grade !== null) return teacher.grade;
  return subject.grade === 'elementary' ? Grades.ELEMENTARY : Grades.MIDDLE_HIGH;
};

const getBranchTeachers =  (teachers: TeacherWithLoad[], branch: string) => {
  const branchTeachers =  teachers.filter(t => t.branch === branch);
  return shuffleArray(branchTeachers);
}

const isTeacherEligible = (teacher: TeacherWithLoad, subject: Subject) => {
  const canTeachFor = MAX_HOURS_PER_TEACHER - teacher.assignedHours;
  if(canTeachFor < subject.hours) return false;

  if(gradeSpecificSubjects.some(s => s.name === subject.name)) {
    const subjectGrade = 
      subject.grade === 'elementary'
      ? Grades.ELEMENTARY
      : Grades.MIDDLE_HIGH;

    if(teacher.grade !== null && teacher.grade !== subjectGrade) return false;
  }
  return true;
}

const loadRequiredData = async (scheduleId: string) => {
  const [classrooms, rawTeachers] = await Promise.all([
    prisma.classroom.findMany({ where: {scheduleId} }),
    prisma.teacher.findMany({ where: {scheduleId}})
  ]);

  if(!classrooms.length){
    throw new Error(`No classrooms found for schedule ${scheduleId}`);
  }
  if(!rawTeachers.length){
    throw new Error(`No teachers found for schedule ${scheduleId}`);
  }

  const teachers: TeacherWithLoad[] = rawTeachers.map( t => ({
    ...t,
    assignedHours: 0,
    grade: null
  }));

  return {classrooms, teachers};
}


const persistSchedule = async (plan: SchedulePlan) => {
  await prisma.$transaction( async (tx) => {
    await tx.lesson.createMany({data: plan.lessons});

    await Promise.all(
        plan.teacherHourUpdates.map(({ id, hours, grade }) =>
        tx.teacher.update({
          where: { id },
          data: { hours, grade },
        })
      )
    )
  }, {timeout: 10000});
}


export const buildSchedule = async (scheduleId: string) => {
  const {classrooms, teachers} = await loadRequiredData(scheduleId);

  const map = new Map<number, Classroom[]>();
  for(const c of classrooms){
    if(!map.has(c.year)){
      map.set(c.year, []);
    }
    map.get(c.year)?.push(c);
  }
  const groupedClassrooms = Array.from(map.values());

  const finalResult = solveYear(
    0, 
    groupedClassrooms, 
    teachers, 
    new Set<string>(), 
    new Set<string>(),
    scheduleId);

  if(!finalResult) {
    console.log('Could not generate a valid schedule with these constraints');
    return {result: false};
  }

  if(finalResult) {
    await persistSchedule({
      lessons: finalResult.lessons,
      teacherHourUpdates: finalResult.teachers.map(t => ({
        id: t.id,
        hours: t.assignedHours,
        grade: t.grade
      }))
    });
    return {result: true};
  }
}