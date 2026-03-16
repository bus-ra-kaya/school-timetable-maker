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
import s from "../style/ProgramBuilder.module.css";
import { useNavigate } from "react-router-dom";
import type { TeacherData, ClassData, lessonSlot } from "../types";
import Modal from "./Modal";

type ProgramBuilderProps = {
  onProgramCreated: (data: lessonSlot[]) => void;
}

export default function ProgramBuilder({onProgramCreated}: ProgramBuilderProps){

  // initialise teachers and classes, add the data to localStorage

  const [teachers, setTeachers] = useState<TeacherData[]>(() => {
    const saved = localStorage.getItem('teachers');
    return saved ? JSON.parse(saved) : [
    {id: nanoid(), name: '', branch: '', placeholder: getRandomName()},
    {id: nanoid(), name: '', branch: '', placeholder: getRandomName()},
    {id: nanoid(), name: '', branch: '', placeholder: getRandomName()},
  ]});

  const [classes, setClasses] = useState<ClassData[]>(() => {
    const saved = localStorage.getItem('classes');
    return saved ? JSON.parse(saved) :  [
    {id: nanoid(), year: 1, class: ''},
    {id: nanoid(), year: 1, class: ''},
    {id: nanoid(), year: 1, class: ''},
  ]});

  useEffect(() => {
    localStorage.setItem("teachers", JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem("classes", JSON.stringify(classes));
  }, [classes]);


  // reset the form state 

  const resetForm = () => {
  setTeachers([
    { id: nanoid(), name: '', branch: '', placeholder: getRandomName() },
    { id: nanoid(), name: '', branch: '', placeholder: getRandomName() },
    { id: nanoid(), name: '', branch: '', placeholder: getRandomName() },
  ]);
  setClasses([
    { id: nanoid(), year: 1, class: '' },
    { id: nanoid(), year: 1, class: '' },
    { id: nanoid(), year: 1, class: '' },
  ]);
};

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

  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);

  const programCheck = () => {
    const program = localStorage.getItem('program');
    if(program){
      setOpen(true);
    }
    else {
      onSubmit();
    }
  }
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
      const [program] = await Promise.all([
        createProgram(teachers, classes),
        new Promise(resolve => setTimeout(resolve, 1000))
      ]);

      if(!program.result || !program.data ){
        setToast({message:'Program oluşturulurken bir hata oluştu.', type: 'error'});
        lastSubmittedRef.current = {teachers, classes};
        return;
      }
      navigate('/program');
      onProgramCreated(program.data);
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

        <button className={`${s.resetBtn} ${s}`} onClick={resetForm}>Sıfırla</button>

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
      onClick={() => programCheck()} 
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

    {open && (
      <Modal
        message="Sistemde kayıtlı bir program bulunmaktadır. Yenisini oluşturmak istediğinize emin misiniz?"
        onConfirm={() => {setOpen(false); onSubmit(); }}
        onCancel={() => setOpen(false)}
      />
    )}
    </>
  )
}