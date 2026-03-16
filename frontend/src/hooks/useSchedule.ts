import type { ClassroomSchedule } from "../types";
import { useEffect, useState } from "react";
import { fetchSchedule } from "../utils/fetchSchedule";

const getSavedSchedule = () => {
  try {
    return JSON.parse(localStorage.getItem('schedule') ?? '[]');
  } catch {
    return [];
  }
}

export function useSchedule() {
  const [schedule, setSchedule] = useState<ClassroomSchedule[]>(() => getSavedSchedule());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSchedule()
      .then(({result, data, error}) => {
        if(result && data){
          setSchedule(data);
          localStorage.setItem('schedule', JSON.stringify(data));
        } else {
          setError(error);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const saveSchedule = (data: ClassroomSchedule[]) => {
    setSchedule(data);
    localStorage.setItem('schedule', JSON.stringify(data));
  };

  return { schedule, isLoading, error, saveSchedule, clearError: () => setError(null)};
}