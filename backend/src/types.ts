import { Grades} from "../generated/prisma/enums";

export type lessonSlot = {
  name: string,
  branch: string,
};

export type Subject = {
  name: string;
  hours: number;
  grade: 'elementary' | 'middle/high';
}

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