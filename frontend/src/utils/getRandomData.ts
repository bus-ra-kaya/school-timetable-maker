import type { TeacherData, ClassData } from "../types";
import { getRandomName } from "./getRandomName";
import { allSubjects } from "../assets/data/subjects";
import { nanoid } from 'nanoid';

const ELEMENTARY_GRADES = [1,2,3,4];
const MIDDLE_HIGH_GRADES = [5,6,7,8,9,10,11,12];
const GRADE_COUNT = 12;
const BRANCH_COUNT = 3;
const CAN_TEACH_ALL_GRADES = new Set([ "Resim","Müzik","Beden Eğitimi","Satranç"]);

export const getRandomData = (maxHoursPerTeacher: number) => {
  const classes: ClassData[] = [];
  const teachers: TeacherData[] = [];

  const classSections = ['A', 'B','C'];

  for(let year = 1; year <= GRADE_COUNT; year++){
    for(const section of classSections){
      classes.push({
        id: nanoid(),
        year,
        class: section
      });
    }
  };

  const seen = new Set<string>();
  const multiGradeSubjects = allSubjects
  .filter(s => CAN_TEACH_ALL_GRADES.has(s.name) && !seen.has(s.name) && seen.add(s.name));  
  const gradeSpecificSubjects = allSubjects.filter(s => !CAN_TEACH_ALL_GRADES.has(s.name));

  multiGradeSubjects.forEach(s => {
    const classCount = GRADE_COUNT * BRANCH_COUNT;
    const canTeach = Math.floor(maxHoursPerTeacher / s.hours);
    const needed = Math.ceil(classCount / canTeach);

    for(let i =0; i < needed; i++){
      teachers.push({id: nanoid(), name: getRandomName(), branch: s.name, placeholder: ''},);
    }
  })

  gradeSpecificSubjects.forEach(s => {
    const gradeCount = s.grade === 'elementary' ? ELEMENTARY_GRADES.length : MIDDLE_HIGH_GRADES.length;
    const classCount = gradeCount * BRANCH_COUNT;
    const canTeach = Math.floor(maxHoursPerTeacher / s.hours);
    const needed = Math.ceil(classCount / canTeach);

    for(let i =0; i < needed; i++){
      teachers.push({id: nanoid(), name: getRandomName(), branch: s.name, placeholder: ''},);
    }
  })
  return {teachers, classes};
}