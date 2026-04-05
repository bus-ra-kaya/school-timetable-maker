import { shuffleArray } from "../../utils/shuffleArray";
import { gradeSpecificSubjects, allSubjects, branchMap, MAX_HOURS_PER_TEACHER } from "../../data/subjects";
import { findAvailableSlots } from "./findAvailableSlots";
import type { TeacherWithLoad, Subject } from "../../types";
import { Grades} from "../../../generated/prisma/enums";
import { prisma } from '../../prisma';

const MAX_RETRIES = 2;

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

export const getNormalizedData = async (scheduleId: string) => {
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

export const lessonScheduler = async (scheduleId: string) =>  {

  const {teachers, classrooms} = await getNormalizedData(scheduleId);

  for(let attempt = 0; attempt < MAX_RETRIES; attempt++){

    const teacherSlots = new Set<string>();
    const classSlots = new Set<string>();

    teachers.forEach(t => {
      t.assignedHours = 0;
      t.grade = null;
    });
  
    let failed = false;

    for(const subject of allSubjects){
      if(failed) break;

      const branch = branchMap[subject.name];
      const eligibleTeachers = shuffleArray(teachers.filter(t => t.branch === branch));

      const subjectGrade = subject.grade === 'elementary' ? Grades.ELEMENTARY : Grades.MIDDLE_HIGH;
      const relevantClassrooms = gradeSpecificSubjects.includes(subject)
      ? classrooms.filter(c => c.grade === subjectGrade)
      : classrooms

      for(const classroom of relevantClassrooms){
        if(failed) break;

        let assigned = false;

        for(const t of eligibleTeachers){
          const eligible = isTeacherEligible(t, subject);

        if (!eligible) {
          continue;
        }
          try{
            const slots = findAvailableSlots(
              t.id,
              classroom.id,
              teacherSlots,
              classSlots,
              subject.hours,
              subject.doubleDaily,
            );

            if (gradeSpecificSubjects.some(s => s.name === subject.name)) {
              const subjectGrade = subject.grade === 'elementary'
                ? Grades.ELEMENTARY
                : Grades.MIDDLE_HIGH;

              if (t.grade === null) {
                t.grade = subjectGrade;
              }
            }

            await prisma.$transaction(async (tx) => {
              await tx.lesson.createMany({
                data: slots.map(slot => ({
                  branch: branchMap[subject.name],
                  teacher_id: t.id,
                  class_id: classroom.id,
                  scheduleId,
                  day: slot.day,
                  hour: slot.hour,
                })),
              });

              await tx.teacher.update({
                where: { id: t.id },
                data: {
                  hours: { increment: subject.hours },
                  grade: t.grade,
                },
              });
            });

            
            t.assignedHours += subject.hours;
            assigned = true;
            break;
          } catch (e) {
            console.error(`Unexpected error assigning ${subject.name}:`, e);
            continue;
          }
        }

        if(!assigned){
          console.log(`Couldn't find a suitable place for ${subject.name} ${classroom.name}`);
          await prisma.lesson.deleteMany({where: {scheduleId}});
          await prisma.teacher.updateMany({
            where: { scheduleId },
            data: { hours: 0, grade: null },
          });

          failed = true;
          break;
        }
      }
    }

    if(!failed){
      return {result: true};
    }
  }
  console.warn(`Failed to build a valid schedule after ${MAX_RETRIES} attempts` );
  return { result: false};
}