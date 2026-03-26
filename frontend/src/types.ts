export type LessonSlot = {
  name: string,
  branch: string,
};

export type ClassroomSchedule = {
  classroom: string;
  teachers: 
     {name: string;
      branch: string;
      totalClasses: number;
    }[];
  lessons: LessonSlot[];
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
