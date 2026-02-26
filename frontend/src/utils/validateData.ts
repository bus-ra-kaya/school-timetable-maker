import type { TeacherData, ClassData } from "../components/TableBuilder"

export const validateData = (teachers: TeacherData[], classes: ClassData[]) => {
  console.log(teachers, classes)

  if(classes.length < 36){
    return false;
  }


  return true;
}