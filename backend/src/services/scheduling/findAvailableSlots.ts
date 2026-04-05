import { Days } from "../../../generated/prisma/enums";
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

// need to make sure the modulo check doesn't result in checking more hours than necessary
const isDoubleSlotFree = (
  teacherId: string,
  classId: string,
  day: Days,
  hour: number,
  teacherSlots: Set<string>,
  classSlots: Set<string>
) => {

  if(hour % 2 === 0) return false;
  return (
    isSlotFree(teacherId, classId, day, hour, teacherSlots, classSlots) &&
    isSlotFree(teacherId, classId, day, hour + 1, teacherSlots, classSlots)
  );
}

const commitSlots = (
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

const findSingleSlots = (
  teacherId: string,
  classId: string,
  teacherSlots: Set<string>,
  classSlots: Set<string>,
  required: number,
  shuffledDays: Days[],
  shuffledHours: number[]
) => {
  const slots = [];

  for (const day of shuffledDays){
    let usedThisDay = false;

    for(const hour of shuffledHours){
      if(usedThisDay) break;

      if(isSlotFree(teacherId, classId, day, hour, teacherSlots, classSlots)){
        slots.push({day, hour});
        usedThisDay= true;
      }
      if (slots.length >= required) break;
    }
    if (slots.length >= required) break;
  }

  if (slots.length < required) {
    throw new Error(`Unable to find ${required} free slots`);
  }

  return slots;
}

const findDoubleSlots = (
  teacherId: string,
  classId: string,
  teacherSlots: Set<string>,
  classSlots: Set<string>,
  required: number,
  shuffledDays:   Days[],
  shuffledHours: number[]
) => {
 
  const slots = [];

  for (const day of shuffledDays){
    let usedThisDay = false;

    for(const hour of shuffledHours){
      if(usedThisDay) break;

      if(isDoubleSlotFree(teacherId, classId, day, hour, teacherSlots, classSlots)){
        const nextHour = hour + 1;
        slots.push({day, hour}, {day, hour: nextHour});
        usedThisDay= true;
      }
      if (slots.length >= required) break;
    }
    if (slots.length >= required) break;
  }

  if (slots.length < required) {
    throw new Error(`Unable to find ${required} free slots`);
  }

  return slots;
}

export const findAvailableSlots = (
  teacherId: string,
  classId: string,
  teacherSlots: Set<string>,
  classSlots: Set<string>,
  required: number,
  doubleDaily: boolean
) => {

  if (doubleDaily && required % 2 !== 0) {
  throw new Error("doubleDaily requires an even number of hours");
  }

  const hours = [1,2,3,4,5,6,7,8];
  const days = Object.values(Days);

  const shuffledDays = shuffleArray(days);
  const shuffledHours = shuffleArray(hours);

  const slots = doubleDaily 
    ? findDoubleSlots(teacherId, classId, teacherSlots, classSlots, required, shuffledDays, shuffledHours)
    : findSingleSlots(teacherId, classId, teacherSlots, classSlots, required, shuffledDays, shuffledHours);

  commitSlots(slots, teacherId, classId, teacherSlots, classSlots);

  return slots;
}