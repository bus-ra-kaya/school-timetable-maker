import { Branches, Days, Grades} from "./generated/prisma/enums.js";

export type lessonSlot = {
  name: string;
  branch: string;
};

export type Subject = {
  name: string;
  hours: number;
  grade: 'elementary' | 'middle/high';
  doubleDaily: boolean;
};

export type TeacherData = {
  id: string;
  name: string;
  branch: string;
  placeholder: string;
};

export type ClassData = {
  id: string;
  year: number;
  class: string;
};

export type TeacherWithLoad = {
  id: string;
  name: string;
  branch: string;
  hours: number;
  grade: Grades | null;
  assignedHours: number;
}

export type Classroom = {
  id: string,
  name: string,
  grade: Grades,
  year: number
}

export type ScheduledLesson = {
  branch: Branches;
  teacher_id: string;
  class_id: string;
  scheduleId: string;
  day: Days;
  hour: number;
}

export type SchedulePlan = {
  lessons: ScheduledLesson[];
  teacherHourUpdates: {
    id: string;
    hours: number;
    grade: Grades | null
  }[]
}

export type SchedulingContext = {
  teacherSlots: Set<string>;
  classSlots: Set<string>;
  teachers: TeacherWithLoad[];
}