import type { TeacherData, ClassData } from '../types';

export function isTeacherDataArray(arr: unknown): arr is TeacherData[] {
  return Array.isArray(arr) && arr.every(t => {
    const teacher = t as Partial<TeacherData>
    return typeof teacher.name === "string" &&
           typeof teacher.branch === "string";
  });
}

export function isClassDataArray(arr: unknown): arr is ClassData[] {
  return Array.isArray(arr) && arr.every(t => {
    const clss = t as Partial<ClassData>
    return typeof clss.class === "string" &&
           typeof clss.year === "number";
  });
}