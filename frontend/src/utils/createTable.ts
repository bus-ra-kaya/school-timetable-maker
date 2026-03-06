import type { TeacherData, ClassData } from "../components/TableBuilder";
import type { lessonSlot } from "../App";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const NODE_MODE = import.meta.env.NODE_ENV;

type returnValue = {
  result: boolean;
  data: lessonSlot[] | null;
  error: string | null;
}

export const createTable = async (teachers: TeacherData[], classes: ClassData[]): Promise<returnValue> => {

  try {
    const response = await fetch(`${API_BASE_URL}/api/timetables`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({teachers, classes})
   });

    if(!response.ok){
      if(NODE_MODE === 'development'){
        try {
          const error = await response.json();
          console.log(error);
        } catch (err){
          console.log(err);
        }
      } 
      return {result: false, data: null, error: 'Sistemsel bir hata yaşandı. Lütfen daha sonra tekrar deneyiniz.'};
    }
    const data = await response.json();
    return {result: true, data: data, error: ''};
  } catch (err){
    if( NODE_MODE === 'development'){
      console.log(err);
    }
    return {result: false, data: null, error: 'Sistemsel bir hata yaşandı. Lütfen daha sonra tekrar deneyiniz.'};
  }
}