import { Branches, Days } from "../../generated/prisma/enums";
import { branchLabelMap, dayMap } from "../data/subjects";

type ScheduleData = {
  classrooms: {
    lessons: {
        teacher: {
            id: string;
            name: string;
            branch: Branches;
            hours: number;
        };
        hour: number;
        day: Days;
    }[];
  name: string;
  }[];
};

export const formatSchedule = (scheduleData: ScheduleData) => {

  const hours = 8;
  const days = 5;
  const formatted = scheduleData?.classrooms.map((classroom) => {
    const teacherMap: Record<string, { name: string; branch: string; totalClasses: number}> = {};

    const lessons = Array(hours * days).fill(null);

    for(const lesson of classroom.lessons) {
      const t = lesson.teacher;

      if(!teacherMap[t.id]) {
        teacherMap[t.id] = {
          name: t.name,
          branch: branchLabelMap[t.branch],
          totalClasses: 0,
        }
      }
      teacherMap[t.id].totalClasses += 1;

    const dayIndex = dayMap[lesson.day];
    const hourIndex = lesson.hour -1;

    const index = (dayIndex * hours) + hourIndex;

    lessons[index] = {
    name: t.name,
    branch: branchLabelMap[t.branch],
    };
  }
    return {
      classroom: classroom.name,
      teachers: Object.values(teacherMap),
      lessons,
    };
  })

  return formatted;
}