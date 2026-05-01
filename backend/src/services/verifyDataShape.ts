import { Branches, Grades } from '../generated/prisma/enums.js';
import type { TeacherData, ClassData } from '../types.js';
import { ELEMENTARY_GRADES, MIDDLE_HIGH_GRADES, GRADE_COUNT, BRANCH_COUNT, gradeSpecificSubjects, multiGradeSubjects, branchMap  } from "../data/subjects.js";

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

export const hasAllGrades = (classes: ClassData[]): boolean => {
  const gradeMap = new Map<number, Set<string>>();
  
  for (const {year, class: cls} of classes){
    let classSet = gradeMap.get(year);
    if (!classSet){
      classSet = new Set<string>();
      gradeMap.set(year, classSet);
    } 
    classSet.add(cls);
  }

  for(let year =1; year <=GRADE_COUNT; year++){
    const classSet = gradeMap.get(year);
    if(!classSet || classSet.size < BRANCH_COUNT){
      return false;
    }
  }
  return true;
}

export const hasAllTeachers = (teachers: TeacherData[], maxHoursPerTeacher: number) => {

  const countByBranch = teachers.reduce<Record<string, number>>(
    (acc, teacher) => {
      acc[teacher.branch] = (acc[teacher.branch] ?? 0) + 1;
      return acc;
    },{});
  
  multiGradeSubjects.forEach(s => {
      const needed = GRADE_COUNT * BRANCH_COUNT;
      const canTeach = Math.floor(maxHoursPerTeacher / s.hours);
      const totalCapacity = (countByBranch[s.name] ?? 0) * canTeach;

      if(totalCapacity < needed){
        return false;
      }
    });

  gradeSpecificSubjects.forEach(s => {
    const gradeCount = s.grade === 'elementary' ? ELEMENTARY_GRADES.length : MIDDLE_HIGH_GRADES.length;
    const needed = gradeCount * BRANCH_COUNT;
    const canTeach = Math.floor(maxHoursPerTeacher / s.hours);
    const totalCapacity = (countByBranch[s.name] ?? 0) * canTeach;

    if(totalCapacity < needed){
      return false;
    } else {
      countByBranch[s.name] = (countByBranch[s.name] ?? 0) - Math.ceil(needed /canTeach);
    }
  })
  
  return true;
};

export const mapTeachers = (data: TeacherData): 
{ name: string, 
  hours: number, 
  branch: Branches} => {

    const branch = branchMap[data.branch];
    
    if(!branch) throw new Error(`Unknown branch: ${data.branch}`);

  return {
    name: data.name,
    hours: 0,
    branch: branch
  };
}

export const mapClasses = (data: ClassData) => {
  return {
    name: `${data.year} - ${data.class}`,
    grade: data.year >= 1 && data.year <= 4 ? Grades.ELEMENTARY : Grades.MIDDLE_HIGH,
    year: data.year
  };
}
