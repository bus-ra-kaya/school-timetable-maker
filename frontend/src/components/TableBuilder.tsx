import ProfBranchForm from "./Form/ProfBranchForm";
import ClassForm from './Form/ClassForm';
import s from '../style/TableBuilder.module.css';
import { validateData } from "../utils/validateData";
import { createTable } from "../utils/createTable";
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

  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const tooltipRef = useRef<HTMLDivElement>(null);
  
  const [teachers, setTeachers] = useState<TeacherData[]>([
    {id: nanoid(), name: '', branch: ''},
  ]);
  const [classes, setClasses] = useState<ClassData[]>([
    {id: nanoid(), year: 1, class: ''},
  ]);

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

  const onSubmit = () => {
    setIsLoading(true);
    const isValid = validateData(teachers, classes);
   
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

    <button onClick={onSubmit} className={s.btn}> Program Oluştur</button>
    </>
  )
}