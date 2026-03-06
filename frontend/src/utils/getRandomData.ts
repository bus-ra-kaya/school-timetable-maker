import type { TeacherData, ClassData } from "../components/TableBuilder";
import { getRandomName } from "./getRandomName";
import { allSubjects } from "../data/subjects";
import { nanoid } from 'nanoid';

const ELEMENTARY_GRADES = [1,2,3,4];
const MIDDLE_HIGH_GRADES = [5,6,7,8,9,10,11,12];
const GRADE_COUNT = 12;
const BRANCH_COUNT = 3;
const MAX_HOURS_PER_TEACHER = 24;
const CAN_TEACH_ALL_GRADES = new Set([ "Resim","Müzik","Beden Eğitimi","Satranç"]);

export const getRandomData = () => {
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
  console.log(gradeSpecificSubjects);

  multiGradeSubjects.forEach(s => {
    const totalHours = GRADE_COUNT * BRANCH_COUNT * s.hours;
    const needed = Math.ceil(totalHours / MAX_HOURS_PER_TEACHER);

    for(let i = 0; i < needed; i++){
      teachers.push({id: nanoid(), name: getRandomName(), branch: s.name, placeholder: ''},);
    }
  })

gradeSpecificSubjects.forEach(s => {
  const gradeCount = s.grade === 'elementary' ? ELEMENTARY_GRADES.length : MIDDLE_HIGH_GRADES.length;
  const totalHours = gradeCount * BRANCH_COUNT * s.hours;
  const needed = Math.ceil(totalHours / MAX_HOURS_PER_TEACHER);

    for(let i =0; i < needed; i++){
      teachers.push({id: nanoid(), name: getRandomName(), branch: s.name, placeholder: ''},);
    }
})
  return {teachers, classes};
}