import { gradeSpecificSubjects, multiGradeSubjects, branchMap, MAX_HOURS_PER_TEACHER } from "../data/subjects";
import type { TeacherWithLoad, ClassroomWithLoad } from "../types";
import { Branches, Grades, Days } from "../../generated/prisma/enums";
import { prisma } from '../prisma';

const elementaryBranches: Partial<Record<Branches, number>> = {
  [Branches.TURKCE]: 0,
  [Branches.MATEMATIK]: 0,
  [Branches.INGILIZCE]: 0,
  [Branches.BEDEN_EGITIMI]: 0,
  [Branches.RESIM]: 0,
  [Branches.MUZIK]: 0,
  [Branches.HAYAT_BILGISI]: 0,
  [Branches.SATRANC]: 0,
};

const middleHighBranches: Partial<Record<Branches, number>>= {
  [Branches.TURKCE]: 0,
  [Branches.MATEMATIK]: 0,
  [Branches.INGILIZCE]: 0,
  [Branches.BEDEN_EGITIMI]: 0,
  [Branches.RESIM]: 0,
  [Branches.MUZIK]: 0,
  [Branches.FEN_BILGISI]: 0,
  [Branches.SATRANC]: 0,
};

const hours = [1,2,3,4,5,6,7,8];
const days = Object.values(Days);


const teacherSlots = new Set<string>();
const classSlots = new Set<string>();

/*const findAvailableTeacher = (teachers: TeacherWithLoad[], subject: Subject) => {

  const eligibleTeachers = teachers.filter(t =>  {
    const canTeachFor = MAX_HOURS_PER_TEACHER - t.assignedHours;
    return t.branch === branchMap[subject.name] && canTeachFor >= subject.hours});

}
  // after finding the teacher
  if(gradeSpecificSubjects.includes(subject)){
    teacher.grade = subject.grade === 'elementary' ? Grades.ELEMENTARY : Grades.MIDDLE_HIGH;
  }
*/

// to add: max 24h per teacher, separated by grades if necessary

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
  required: number = 1
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
      }

      if (!usedThisDay) {
        slots.push({ day, hour });
        usedThisDay = true;
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


const lessonScheduler = async () =>  {
  const rawClassrooms = await prisma.classroom.findMany();
  const rawTeachers = await prisma.teacher.findMany();

  const teachers: TeacherWithLoad[] = rawTeachers.map(teacher => ({
  ...teacher,
  assignedHours: 0,
  }));
  const classrooms: ClassroomWithLoad[] = rawClassrooms.map(classroom => ({
    ...classroom,
    branchCounts:  classroom.grade === Grades.ELEMENTARY
      ? { ...elementaryBranches }
      : { ...middleHighBranches }
  }));

  for(const subject of multiGradeSubjects){
    const branch = branchMap[subject.name];
    const eligibleTeachers = teachers.filter(t =>  t.branch === branch);
    
    for (const classroom of classrooms){

      let remainingHours = subject.hours;

      let slots: {day: Days; hour: number}[] = [];
      let teacher: TeacherWithLoad | undefined;

      for(const t of eligibleTeachers){
        try {
          slots = findAvailableSlots(t, classroom.id, remainingHours);
          teacher = t;
          break;
        } catch {
          continue;
        }
      }
      
      if (!teacher) {
        console.error(`No teacher can cover ${subject.name} for classroom ${classroom.name}`);
        break;
      }
      for(const _ of slots){
        teacher.assignedHours++;
        classroom.branchCounts[branch] = (classroom.branchCounts[branch] ?? 0) + 1;
      }
    }
  }

  // need to check what needs to be returned for 

  for (const subject of gradeSpecificSubjects) {
    const branch = branchMap[subject.name];
    const eligibleTeachers = teachers.filter(t =>  t.branch === branch);
    
    const gradeEnum = subject.grade === 'elementary' ? Grades.ELEMENTARY : Grades.MIDDLE_HIGH;
    
    for (const classroom of classrooms){
      if(classroom.grade !== gradeEnum) continue;

      let remainingHours = subject.hours;

      let slots: {day: Days; hour: number}[] = [];
      let teacher: TeacherWithLoad | undefined;

      for(const t of eligibleTeachers){
        try {
          slots = findAvailableSlots(t, classroom.id, remainingHours);
          teacher = t;
          break;
        } catch {
          continue;
        }
      }
      
      if (!teacher) {
        console.error(`No teacher can cover ${subject.name} for classroom ${classroom.name}`);
        break;
      }
      for(const _ of slots){
        teacher.assignedHours++;
        classroom.branchCounts[branch] = (classroom.branchCounts[branch] ?? 0) + 1;
      }
    }
  }
}

  // still confused about the partial making it so that some part may be undefined

  