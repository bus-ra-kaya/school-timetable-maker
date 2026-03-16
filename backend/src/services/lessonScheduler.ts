import { Days } from "../../generated/prisma/enums";
import { gradeSpecificSubjects, multiGradeSubjects } from "../data/subjects";
import { prisma } from '../prisma';


const hours = [1,2,3,4,5,6,7,8];
const days = Object.values(Days)

const teacherSlots = new Set<string>();
const classSlots = new Set<string>();

const isSlotFree = (teacherId: string, classId: string, day: Days, hour: number) => {
  return (
    !teacherSlots.has(`${teacherId}-${day}-${hour}`) &&
    !classSlots.has(`${classId}-${day}-${hour}`)
  );
}

const findFreeSlot = (teacherId: string, classId: string) => {
  for (const day of days) {
    for(const hour of hours){
      if (isSlotFree(teacherId, classId, day, hour)){
        return {day, hour};
      }
    }
  }
}


const lessonScheduler = async () =>  {
  const classrooms = await prisma.classroom.findMany();
  const teachers = await prisma.teacher.findMany();


// debate using parameters which you'd get by the previous classroom and teacher entries written to the db
  // to be updated
}