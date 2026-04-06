import { Days, Grades} from "../generated/prisma/enums";

export type lessonSlot = {
  name: string;
  branch: string;
};

export type DateSlot = {
  day: Days;
  hour: number;
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
  grade: Grades
}