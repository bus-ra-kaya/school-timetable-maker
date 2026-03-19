import { ClassData } from "../types";
import { GRADE_COUNT, BRANCH_COUNT } from "../data/subjects";

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