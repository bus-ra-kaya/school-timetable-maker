import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Info, Dices } from "lucide-react";
import { nanoid } from "nanoid";
import ProfBranchForm from "./Form/ProfBranchForm";
import ClassForm from "./Form/ClassForm";
import Toast from "./Toast";
import Tooltip from "./Tooltip";
import Modal from "./Modal";
import { getRandomName } from "../utils/getRandomName";
import { getRandomData } from "../utils/getRandomData";
import { validateData } from "../services/validateData";
import { createSchedule } from "../services/createSchedule";
import type { TeacherData, ClassData, ClassroomSchedule } from "../types";
import s from "../style/ScheduleBuilder.module.css";

type ScheduleBuilderProps = {
  onScheduleCreated: (data: ClassroomSchedule[]) => void;
}

//would probably be a good idea to separate this into smaller functions

export default function ScheduleBuilder({onScheduleCreated}: ScheduleBuilderProps){
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

  const scheduleCheck = () => {
    const schedule = localStorage.getItem('schedule');
    if(schedule){
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
      const [schedule] = await Promise.all([
        createSchedule(teachers, classes),
        new Promise(resolve => setTimeout(resolve, 1000))
      ]);

      if(!schedule.data ){
        setToast({message:'Program oluşturulurken bir hata oluştu.', type: 'error'});
        lastSubmittedRef.current = {teachers, classes};
        return;
      }
      navigate(`/schedule/${schedule.data.scheduleId}`);
      onScheduleCreated(schedule.data.schedule);
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

  //refocus the trigger button when the modal closes
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleCancel = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleConfirm = () => {
    setOpen(false);
    triggerRef.current?.focus();
    onSubmit();
  }

  return(
    <>
    <div className={s.tableBuilder}>
      
      <div className={s.header}>
        <div className={s.titleContainer}>
          <h1 className={s.title}>
          Ders Programı Hazırlama
          </h1>
          <Tooltip text="Öğretmen ve sınıf bilgilerini ekleyin, ardından Program Oluştur butonuna tıklayın. Çakışmalar otomatik olarak kontrol edilir.">
            <button aria-label='Bilgi' className={s.info}>
              <Info className={s.icon} aria-hidden='true' />
            </button>
        </Tooltip>
        </div>
        <button className={s.resetBtn} onClick={resetForm}>Sıfırla</button>
      </div>

      <div className={s.teacherSelector}>
        <ProfBranchForm teachers={teachers} setTeachers={setTeachers} />
      </div>
      <div className={s.classSelector}>
        <ClassForm classes={classes} setClasses={setClasses} />
      </div>

      <div className={s.btnContainer}>
      <button 
        ref={triggerRef}
        onClick={() => {
          if (!isLoading && isFormChanged) scheduleCheck();
        }}
        className={s.primaryBtn}
        aria-disabled={isLoading || !isFormChanged}
        aria-busy={isLoading}
      > 
        <span aria-hidden='true'>{isLoading ? dots : 'Program Oluştur'}</span>
        <span className="sr-only">{isLoading ? 'Yükleniyor' : 'Program Oluştur'}</span>
      </button>

      <Tooltip text='Öğretmenleri ve sınıfları otomatik oluşturur.'>
        <button className={s.secondaryBtn} onClick={() => generateFormData()}>
        <Dices aria-hidden='true' /> Rastgele doldur
        </button>
      </Tooltip>
    </div>
    </div>

    <div aria-live='polite' aria-atomic='true'>
      {toast && (
      <Toast
        message={toast.message}
        onClose={() => {setToast(null);}}
      />
    )}
    </div>

    {open && (
      <Modal onConfirm={handleConfirm} onCancel={handleCancel}>
        <p>Sistemde kayıtlı bir program bulunmaktadır. Yenisini oluşturmak istediğinize emin misiniz?</p>
      </Modal>
    )}
    </>
  )
}