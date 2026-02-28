import type { TeacherData, ClassData } from "../components/TableBuilder";

const YEARS = [1,2,3,4,5,6,7,8,9,10,11,12];
const BRANCH_COUNT = 3;

type ValidationResult = {
  result: boolean;
  error: string | null;
}

export function validateData (teachers: TeacherData[], classes: ClassData[]):ValidationResult{
  
  if(classes.length < YEARS.length * BRANCH_COUNT){
    return {result: false, error: `${YEARS.length} yıl için de ${BRANCH_COUNT}'er şube olacak şekilde eksik sınıfları ekleyiniz.`};
  }

  return {result: true, error: null};
};

const hasAllClasses = (classes: ClassData[]): boolean => {
  const pairs = new Set<string>();
}
