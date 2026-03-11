import { useEffect, useRef, useState } from "react";
import { Info, Dices } from "lucide-react";
import { nanoid } from "nanoid";

import ProfBranchForm from "./Form/ProfBranchForm";
import ClassForm from "./Form/ClassForm";
import Toast from "./Toast";
import Tooltip from "./Tooltip";

import { getRandomName } from "../utils/getRandomName";
import { getRandomData } from "../utils/getRandomData";
import { validateData } from "../utils/validateData";
import { createProgram } from "../utils/createProgram";

import type { lessonSlot } from "../App";

import s from "../style/TableBuilder.module.css";

export type TeacherData = {
  id: string;
  name: string;
  branch: string;
  placeholder: string;
}

export type ClassData = {
  id: string;
  year: number;
  class: string;
}

type TableBuilderProps = {
  ifProgramCreated: () => void;
  setTimeTables: React.Dispatch<React.SetStateAction<lessonSlot[]>>
}

export default function TableBuilder({ifProgramCreated, setTimeTables}: TableBuilderProps){
  
  const [teachers, setTeachers] = useState<TeacherData[]>([
    {id: nanoid(), name: '', branch: '', placeholder: getRandomName()},
    {id: nanoid(), name: '', branch: '', placeholder: getRandomName()},
    {id: nanoid(), name: '', branch: '', placeholder: getRandomName()},
  ]);
  const [classes, setClasses] = useState<ClassData[]>([
    {id: nanoid(), year: 1, class: ''},
    {id: nanoid(), year: 1, class: ''},
    {id: nanoid(), year: 1, class: ''},
  ]);

  // button set to loading logic
  const [dots, setDots] = useState('.');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading) {
      setDots('.');
      return;
    }
    const interval = setInterval(() => {
      setDots(prev => prev.length < 3 ? prev + '.' : '.');
    },500);

    return () => clearInterval(interval);
  }, [isLoading]);

  // toast notification logic

  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success';} | null>(null);

  // form submit logic

  const onSubmit = async () => {
    setToast(null);
    setIsLoading(true);

    const {result, error: validationError} = validateData(teachers, classes);
    if(!result && validationError){
      setToast({message: validationError, type: 'error'});
      setIsLoading(false);
      return;
    }

    try {

      const [timetables] = await Promise.all([
        createProgram(teachers, classes),
        new Promise(resolve => setTimeout(resolve, 1000))
      ]);

      if(!timetables.result || !timetables.data ){
        setToast({message:'Program oluşturulurken bir hata oluştu.', type: 'error'});
        lastSubmittedRef.current = {teachers, classes};
        return;
      }
      setTimeTables(timetables.data);
      ifProgramCreated();
      } catch (err) {
      if(import.meta.env.NODE_ENV === 'development'){
      console.error(err);
      }
      setToast({message:'Program oluşturulurken bir hata oluştu.', type: 'error'});
    } finally {
      setIsLoading(false);
    }
  }

  // check if the form has been updated before reenabling the submit button

  const lastSubmittedRef = useRef({teachers, classes});

  const isFormChanged = JSON.stringify({ teachers, classes }) !==
  JSON.stringify(lastSubmittedRef.current);

  // generate random data

  const generateFormData = () => {
    const {teachers, classes} = getRandomData();
    setTeachers(teachers);
    setClasses(classes);
  }

  return(
    <>
    <div className={s.tableBuilder}>
      <div className={s.header}>
        <h3>Ders Programı Hazırlama</h3>

        <Tooltip text="Öğretmen ve sınıf bilgilerini ekleyin, ardından Program Oluştur butonuna tıklayın. Çakışmalar otomatik olarak kontrol edilir.">
          <button aria-label='Info' className={s.info}>
            <Info className={s.icon}/>
          </button>
        </Tooltip>
      </div>
      <div className={s.teacherSelector}>
        <ProfBranchForm teachers={teachers} setTeachers={setTeachers} />
      </div>
      <div className={s.classSelector}>
        <ClassForm classes={classes} setClasses={setClasses} />
      </div>
    </div>

    <div className={s.btnContainer}>
      <button 
      onClick={onSubmit} 
      className={s.btn}
      disabled={isLoading || !isFormChanged}> {isLoading ? dots : 'Program Oluştur'}
      </button>

      <Tooltip text='Öğretmenleri ve sınıfları otomatik oluşturur.'>
        <button className={s.btn} onClick={() => generateFormData()}>
        <Dices />
        </button>
      </Tooltip>
    </div>

    {toast && (
      <Toast
        message={toast.message}
        onClose={() => {setToast(null);}}
      />
    )}
    </>
  )
}