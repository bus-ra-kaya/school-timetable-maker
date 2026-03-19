import { TeacherData} from "../types";
import { ELEMENTARY_GRADES, MIDDLE_HIGH_GRADES, GRADE_COUNT, BRANCH_COUNT, MAX_HOURS_PER_TEACHER, gradeSpecificSubjects, multiGradeSubjects  } from "../data/subjects";

export const hasAllTeachers = (teachers: TeacherData[]) => {

  const countByBranch = teachers.reduce<Record<string, number>>(
    (acc, teacher) => {
      acc[teacher.branch] = (acc[teacher.branch] ?? 0) + 1;
      return acc;
    },{});

  for (const s of multiGradeSubjects) {
    const totalHours = GRADE_COUNT * BRANCH_COUNT * s.hours;
    const needed = Math.ceil(totalHours /MAX_HOURS_PER_TEACHER);

    if(!countByBranch[s.name] || countByBranch[s.name] < needed){
      return false;
    }
  };

  for (const s of gradeSpecificSubjects) {
    const gradeCount = s.grade === 'elementary' ? ELEMENTARY_GRADES.length : MIDDLE_HIGH_GRADES.length;
    const totalHours = gradeCount * BRANCH_COUNT * s.hours;
    const needed = Math.ceil(totalHours /MAX_HOURS_PER_TEACHER);

    if(!countByBranch[s.name] || countByBranch[s.name] < needed){
      return false;
    } else {
      countByBranch[s.name] -= needed;
    }
  }
  return true;
};