import type { TeacherData, ClassData } from "../components/TableBuilder";
import { allSubjects } from "../data/subjects";

const ELEMENTARY_GRADES = [1,2,3,4];
const MIDDLE_HIGH_GRADES = [5,6,7,8,9,10,11,12];
const GRADE_COUNT = 12;
const BRANCH_COUNT = 3;
const MAX_HOURS_PER_TEACHER = 24;
const CAN_TEACH_ALL_GRADES = new Set([ "Resim","Müzik","Beden Eğitimi","Satranç"]);

type ValidationResult = {
  result: boolean;
  error: string | null;
}

export function validateData (teachers: TeacherData[], classes: ClassData[]):ValidationResult{
  
  // checking if all classes are in order
  if(classes.length < GRADE_COUNT * BRANCH_COUNT){
    return {result: false, error: `${GRADE_COUNT} yıl için de ${BRANCH_COUNT}'er şube olacak şekilde eksik sınıfları ekleyiniz.`};
  }

  if(classes.length > GRADE_COUNT * BRANCH_COUNT){
    return { result: false, error: `Sistem ${GRADE_COUNT} x ${BRANCH_COUNT} şube için tasarlanmıştır. Lütfen fazladan olan sınıfları siliniz.`};
  }

  const isComplete = hasAllGrades(classes);

  if(!isComplete){
    return {result: false, error: `${GRADE_COUNT} yıl için de ${BRANCH_COUNT}'er şube olacak şekilde eksik sınıfları ekleyiniz.`};
  }

  const shortages = checkTeacherShortages(teachers);

  if(shortages.length > 0){
    return {result: false, error: `${shortages.join(', ')} dersleri için eksik öğretmenler bulunmaktadır.`};
  }
  return {result: true, error: null};
};

const hasAllGrades = (classes: ClassData[]): boolean => {

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

const checkTeacherShortages = (teachers: TeacherData[]) => {

  const shortages = new Set<string>();
  const countByBranch = teachers.reduce<Record<string, number>>(
    (acc, teacher) => {
      acc[teacher.branch] = (acc[teacher.branch] ?? 0) + 1;
      return acc;
    },{});

  const seen = new Set<string>();
  const multiGradeSubjects = allSubjects
  .filter(s => CAN_TEACH_ALL_GRADES.has(s.name) && !seen.has(s.name) && seen.add(s.name));
  const gradeSpecificSubjects = allSubjects.filter(s => !CAN_TEACH_ALL_GRADES.has(s.name));

  multiGradeSubjects.forEach(s => {
    const totalHours = GRADE_COUNT * BRANCH_COUNT * s.hours;
    const needed = Math.ceil(totalHours /MAX_HOURS_PER_TEACHER);

    if(!countByBranch[s.name] || countByBranch[s.name] < needed){
      shortages.add(s.name);
    }
  });

  gradeSpecificSubjects.forEach(s => {
    const gradeCount = s.grade === 'elementary' ? ELEMENTARY_GRADES.length : MIDDLE_HIGH_GRADES.length;
    const totalHours = gradeCount * BRANCH_COUNT * s.hours;
    const needed = Math.ceil(totalHours /MAX_HOURS_PER_TEACHER);

    if(!countByBranch[s.name] || countByBranch[s.name] < needed){
      shortages.add(s.name);
    } else {
      countByBranch[s.name] -= needed;
    }
  })

  return Array.from(shortages);
}