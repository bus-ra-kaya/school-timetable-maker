import { gradeSpecificSubjects, allSubjects, branchMap, MAX_HOURS_PER_TEACHER } from "../data/subjects";
import type { TeacherWithLoad, Subject } from "../types";
import { Grades, Days } from "../../generated/prisma/enums";
import { prisma } from '../prisma';

const hours = [1,2,3,4,5,6,7,8];
const days = Object.values(Days);

const isTeacherEligible = (t: TeacherWithLoad, subject: Subject) => {
  const canTeachFor = MAX_HOURS_PER_TEACHER - t.assignedHours;
  if (canTeachFor < subject.hours) return false;

  if (gradeSpecificSubjects.includes(subject)) {
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

const shuffleArray = <T>(array: T[]): T[] => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const findAvailableSlots = (
  teacher: TeacherWithLoad,
  classId: string,
  teacherSlots: Set<string>,
  classSlots: Set<string>,
  required: number = 1,
) => {
  const slots: { day: Days; hour: number }[] = [];

  const shuffledDays = shuffleArray(days);
  const shuffledHours = shuffleArray(hours);

  for (const day of shuffledDays) {
    let usedThisDay = false;

    for (const hour of shuffledHours) {
      if (usedThisDay) break;

      const key = `${teacher.id}-${day}-${hour}`;
      const classKey = `${classId}-${day}-${hour}`;

      const isFree =
        !teacherSlots.has(key) &&
        !classSlots.has(classKey);

      if (!isFree) continue;

      if ((slots.length + 2) <= required) {
        const nextHour = hour + 1;
        const prevHour = hour - 1;

        const tryPair = (adjHour: number) => {
          const adjKey = `${teacher.id}-${day}-${adjHour}`;
          const adjClassKey = `${classId}-${day}-${adjHour}`;

          return (
            hours.includes(adjHour) &&
            !teacherSlots.has(adjKey) &&
            !classSlots.has(adjClassKey)
          );
        };

        if (tryPair(nextHour)) {
          slots.push({ day, hour }, { day, hour: nextHour });
          usedThisDay = true;
        } else if (tryPair(prevHour)) {
          slots.push({ day, hour: prevHour }, { day, hour });
          usedThisDay = true;
        }
      } else {
        if (!usedThisDay) {
          slots.push({ day, hour });
          usedThisDay = true;
        }
      }

      if (slots.length >= required) {
        slots.splice(required); 
        slots.forEach(slot => {
          teacherSlots.add(`${teacher.id}-${slot.day}-${slot.hour}`);
          classSlots.add(`${classId}-${slot.day}-${slot.hour}`);
        });
        return slots;
      }
    }
  }

  throw new Error(
    `Unable to find ${required} free slots for teacher ${teacher.id} and class ${classId}`
  );
};

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

const lessonScheduler = async (scheduleId: string) =>  {


  const teacherSlots = new Set<string>();
  const classSlots = new Set<string>();

  const {teachers, classrooms} = await getNormalizedData(scheduleId);

  for(const subject of allSubjects){

    const branch = branchMap[subject.name];
    const eligibleTeachers = shuffleArray(
      teachers.filter(t => t.branch === branch)
    );
    
    for (const classroom of classrooms){

      for(const t of eligibleTeachers){
         if (!isTeacherEligible(t, subject)) continue;

        try {

          const slots = findAvailableSlots(t, classroom.id, teacherSlots, classSlots, subject.hours,);

          if(gradeSpecificSubjects.includes(subject)){
          t.grade =  subject.grade === 'elementary' ? Grades.ELEMENTARY : Grades.MIDDLE_HIGH;
          } else {
            t.grade = null;
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
                hours: {
                  increment: subject.hours,
                },
                grade: t.grade,
              },
            });
          });

          t.assignedHours = subject.hours;

        break;

        } catch { 
        continue;
        }
      }
    }
  }
}
  

// lower the cognitive load on the functions
// the slotFinder has some logical issues
// still need to use this function in index.ts and return the lessons somehow
