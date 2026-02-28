import ProfBranchForm from "./Form/ProfBranchForm";
import ClassForm from './Form/ClassForm';
import s from '../style/TableBuilder.module.css';
import { validateData } from "../utils/validateData";
import { createTable } from "../utils/createTable";
import Toast from "./Toast";
import { Info } from 'lucide-react';
import { useEffect, useRef, useState } from "react";
import {nanoid} from 'nanoid';

type TableBuilderProps = {
  onCreateClick: () => void;
}

export type TeacherData = {
  id: string;
  name: string;
  branch: string;
}

export type ClassData = {
  id: string;
  year: number;
  class: string;
}

export default function TableBuilder({onCreateClick}: TableBuilderProps){
  
  const [teachers, setTeachers] = useState<TeacherData[]>([
    {id: nanoid(), name: '', branch: ''},
  ]);
  const [classes, setClasses] = useState<ClassData[]>([
    {id: nanoid(), year: 1, class: ''},
  ]);


  //tooltip toggle logic

  const [open, setOpen] = useState<boolean>(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if(tooltipRef.current && !tooltipRef.current.contains(event.target as Node)){
        setOpen(false);
      }
    };
    if(open){
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open])

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

  const [error, setError] = useState<string | null>(null);

  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success';} | null>(null);

  useEffect(() => {
    if (!error) return;

    setToast({
      message: error,
      type: 'error'
    });
  }, [error]);

  // form subit logic

  const onSubmit = async () => {
    setError(null);
    setIsLoading(true);

    const {result, error: validationError} = validateData(teachers, classes);
    if(!result){setError(validationError);
        return;
      }

    try {
       await createTable(teachers, classes);
      } catch (err) {
      if(import.meta.env.NODE_ENV === 'development'){
        console.error(err);
      }
      setError('Program oluşturulurken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  }

  return(
    <>
    <div className={s.tableBuilder}>
      <div className={s.header} ref={tooltipRef}>
        <h3>Ders Programı Hazırlama</h3>

        <span className={s.infoWrapper}>
          <button onClick={() => {setOpen(prev => !prev)}} aria-label='Info'>
            <Info className={s.icon}/>
          </button>

          { open && (
          <span className={s.tooltip}> Öğretmen ve sınıf bilgilerini ekleyin, ardından Program Oluştur butonuna tıklayın. Çakışmalar otomatik olarak kontrol edilir. </span>
          )}
        </span>
      </div>
      <div className={s.teacherSelector}>
        <ProfBranchForm teachers={teachers} setTeachers={setTeachers} />
      </div>
      <div className={s.classSelector}>
        <ClassForm classes={classes} setClasses={setClasses} />
      </div>
    </div>

    <button 
      onClick={onSubmit} 
      className={s.btn}
      disabled={isLoading}> {isLoading ? dots : 'Program Oluştur'}
    </button>

    {toast && (
      <Toast
        message={toast.message}
        onClose={() => {setError(null); setToast(null);}}
      />
    )}
    </>
  )
}


// need to fix the button getting shorter when isLoading is true