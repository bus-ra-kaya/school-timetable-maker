import type { lessonSlot } from "../types";
import { useEffect, useState } from "react";
import { fetchProgram } from "../utils/fetchProgram";

const getSavedProgram = () => {
  try {
    return JSON.parse(localStorage.getItem('program') ?? '[]');
  } catch {
    return [];
  }
}

export function useProgram() {
  const [program, setProgram] = useState<lessonSlot[]>(() => getSavedProgram());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProgram()
      .then(({result, data, error}) => {
        if(result && data){
          setProgram(data);
          localStorage.setItem('program', JSON.stringify(data));
        } else {
          setError(error);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const saveProgram = (data: lessonSlot[]) => {
    setProgram(data);
    localStorage.setItem('program', JSON.stringify(data));
  };

  return { program, isLoading, error, saveProgram, clearError: () => setError(null)};
}