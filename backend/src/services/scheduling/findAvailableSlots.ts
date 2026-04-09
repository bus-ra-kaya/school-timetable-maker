import { Days } from "../../../generated/prisma/enums";
import { SchedulingContext, Subject } from "../../types";
import { shuffleArray } from "../../utils/shuffleArray";

const isSlotFree = (
  teacherId: string,
  classId: string,
  day: Days,
  hour: number,
  teacherSlots: Set<string>,
  classSlots: Set<string>
) => {
  const teacherKey = `${teacherId}-${day}-${hour}`;
  const classKey = `${classId}-${day}-${hour}`;

  return !teacherSlots.has(teacherKey) && !classSlots.has(classKey);
}

export const commitSlots = (
  slots: {day: string, hour: number}[],
  teacherId: string,
  classId: string,
  teacherSlots: Set<string>,
  classSlots: Set<string>
) => {
  for (const slot of slots) {
    teacherSlots.add(`${teacherId}-${slot.day}-${slot.hour}`);
    classSlots.add(`${classId}-${slot.day}-${slot.hour}`);
  }
}

export const uncommitSlots = (
  slots: {day: Days; hour: number}[],
  teacherId: string,
  classId: string,
  teacherSlots: Set<string>,
  classSlots: Set<string>
) => {
  for(const slot of slots){
    teacherSlots.delete(`${teacherId}-${slot.day}-${slot.hour}`);
    classSlots.delete(`${classId}-${slot.day}-${slot.hour}`);
  }
}

export const findAvailableSlots = (
  teacherId: string,
  classId: string,
  context: SchedulingContext,
  subject: Subject
) => {
  const hours = [1, 2, 3, 4, 5, 6, 7, 8];
  const days = Object.values(Days);

  const shuffledDays = shuffleArray([...days]);
 
  let slots = searchDoubleSlots(teacherId, classId, context, subject.hours, shuffledDays)

  if(!slots) {
    slots = searchSingleSlots(teacherId, classId, context, subject.hours, shuffledDays, hours);
  }

  if(slots) return slots;
  return null;
}

const searchSingleSlots = (
  teacherId: string,
  classId: string,
  context: SchedulingContext,
  required: number,
  shuffledDays: Days[],
  shuffledHours: number[],
) => {

  const selectedSlots = [];

  for(const day of shuffledDays) {
    let usedThisDay = false;
    for (const hour of shuffledHours) {
      if (usedThisDay) break;

      if (isSlotFree(teacherId, classId, day, hour, context.teacherSlots, context.classSlots)) {
        selectedSlots.push({ day, hour });
        usedThisDay = true;
      }
      if(selectedSlots.length === required) {
        return selectedSlots;}
    }
  }
  return null;
}

const searchDoubleSlots = (
  teacherId: string,
  classId: string,
  context: SchedulingContext,
  required: number,
  shuffledDays: Days[],
) => {
  const selectedSlots = [];

  const doubleHours = [1,3,5,7];
  const shuffledHours = shuffleArray(doubleHours);

 for (const day of shuffledDays) {
    let usedThisDay = false;

    for (const hour of shuffledHours) {
      if(usedThisDay) break;

      if (
        isSlotFree(teacherId, classId, day, hour, context.teacherSlots, context.classSlots) &&
        isSlotFree(teacherId, classId, day, hour + 1, context.teacherSlots, context.classSlots)
      ) {
        selectedSlots.push({ day, hour: hour }, { day, hour: hour + 1 });
        usedThisDay = true;
        
        if (selectedSlots.length === required) {
          return selectedSlots;}
        break;
      }
    }
  }
  return null;
}

