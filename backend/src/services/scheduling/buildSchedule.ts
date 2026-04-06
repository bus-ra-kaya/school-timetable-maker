import {prisma} from '../../prisma';
import { TeacherWithLoad, Classroom, Subject, DateSlot } from "../../types";
import { allSubjects, branchMap, gradeSpecificSubjects, MAX_HOURS_PER_TEACHER } from "../../data/subjects";
import { shuffleArray } from "../../utils/shuffleArray";
import { Grades } from "../../../generated/prisma/enums";
import { findAvailableSlots } from './findAvailableSlots';

type SchedulingContext = {
  teacherSlots: Set<string>;
  classSlots: Set<string>;
  teachers: TeacherWithLoad[];
}

const persistLessons = async (
  scheduleId: string,
  teacher: TeacherWithLoad,
  classroom: Classroom,
  subject: Subject,
  slots: DateSlot[],
) =>  {
  await prisma.$transaction(async (tx) => {
    await tx.lesson.createMany({
      data: slots.map(slot => ({
        branch: branchMap[subject.name],
        teacher_id: teacher.id,
        class_id: classroom.id,
        scheduleId,
        day: slot.day,
        hour: slot.hour,
      })),
    });

    await tx.teacher.update({
      where: { id: teacher.id },
      data: {
        hours: { increment: subject.hours },
        grade: teacher.grade,
      },
    });
  });
};

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

const assignToClassroom = async (
  subject: Subject,
  classroom: Classroom,
  teachers: TeacherWithLoad[],
  scheduleId: string,
  context: SchedulingContext
): Promise<boolean> => {
  
  for(const teacher of teachers) {
    if(!isTeacherEligible(teacher, subject)) continue;

    try {
      const slots = findAvailableSlots(
        teacher.id,
        classroom.id,
        context.teacherSlots,
        context.classSlots,
        subject.hours,
        subject.doubleDaily
      );

      updateTeacherGradeIfNeeded(teacher, subject);

      await persistLessons(
        scheduleId,
        teacher,
        classroom,
        subject,
        slots
      );
      teacher.assignedHours += subject.hours;
      return true;

    } catch (e) {
      console.error(`Error assigning ${subject.name}`, e);
    }
  }
  return false;
}

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
  return shuffleArray(teachers.filter(t => t.branch === branch));
};

const assignSubject = async (
  subject: Subject,
  scheduleId: string,
  context: SchedulingContext,
  classrooms: Classroom[]
): Promise<boolean> => {

  const branch = branchMap[subject.name];
  const eligibleTeachers = getEligibleTeachers(context.teachers, branch);
  const relevantClassrooms = getRelevantClassrooms(subject, classrooms);

  for(const classroom of relevantClassrooms){
    const success = await assignToClassroom(
      subject,
      classroom,
      eligibleTeachers,
      scheduleId,
      context
    );

    if (!success) {
      console.log(`Couldn't place ${subject.name} in ${classroom.name}`);
      return false;
    }
  }
  return true;
}

const createSchedulingContext = (teachers: TeacherWithLoad[]) => {
  const teacherSlots = new Set<string>();
  const classSlots = new Set<string>();

  teachers.forEach(t => {
    t.assignedHours = 0;
    t.grade = null;
  });

  return { teacherSlots, classSlots, teachers };
};

const handleFailure = async (scheduleId: string) => {
  await prisma.lesson.deleteMany({ where: { scheduleId } });

  await prisma.teacher.updateMany({
    where: { scheduleId },
    data: { hours: 0, grade: null },
  });
};

const tryBuildSchedule = async (
  scheduleId: string, 
  teachers: TeacherWithLoad[],
  classrooms: Classroom[]
):Promise<boolean> => {

  const context = createSchedulingContext(teachers);

  for(const subject of allSubjects){
    const success = await assignSubject(
      subject,
      scheduleId,
      context,
      classrooms
    );

    if(!success){
      await handleFailure(scheduleId);
      return false;
    }
  }
  return true;
}

const getNormalizedData = async (scheduleId: string) => {
  const classrooms = await prisma.classroom.findMany({
    where: {
      scheduleId: scheduleId},
    })
  const rawTeachers = await prisma.teacher.findMany({
    where: {
      scheduleId: scheduleId},
    });

  const teachers: TeacherWithLoad[] = rawTeachers.map(teacher => ({
  ...teacher,
  assignedHours: 0,
  }));

  return {teachers, classrooms};
}

export const buildSchedule = async (scheduleId: string) => {
  const {teachers, classrooms} = await getNormalizedData(scheduleId);

  const maxRetries = 2;
  for(let attempt = 0; attempt < maxRetries; attempt++){
    const success = await tryBuildSchedule(scheduleId, teachers,classrooms);
    if(success) return {result: true};
  }

  console.warn(`Failed after ${maxRetries} attempts of trying build a schedule`);
  return { result: false};
}