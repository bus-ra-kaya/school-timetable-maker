import { getNormalizedData } from "./lessonScheduler";
import { TeacherWithLoad } from "../../types";

const tryBuildSchedule = async (
  scheduleId: string, 
  teachers: TeacherWithLoad[]
) => {

  const teacherSlots = new Set<string>();
    const classSlots = new Set<string>();

    teachers.forEach(t => {
      t.assignedHours = 0;
      t.grade = null;
    });
  


  return false;
}

export const lessonScheduler = async (scheduleId: string) => {
  const {teachers, classrooms} = await getNormalizedData(scheduleId);

  const maxRetries = 2;
  for(let attempt = 0; attempt < maxRetries; attempt++){
    const success = await tryBuildSchedule(scheduleId, teachers,);
    if(success) return {result: true};
  }

  console.warn(`Failed after ${maxRetries} attempts of trying build a schedule`);
  return { result: false};
}