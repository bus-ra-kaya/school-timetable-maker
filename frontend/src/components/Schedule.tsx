import {ArrowLeftFromLine, FileDown} from 'lucide-react';
import type { ClassroomSchedule } from '../types';
import {exportSchedule} from '../services/exportSchedule';
import { useNavigate } from 'react-router-dom';
import s from '../style/Schedule.module.css';
import Modal from './Modal';
import { useState } from 'react';

const HOUR_COUNT = 8;
const DAYS_COUNT = 5;

type ScheduleProps = {
  schedule: ClassroomSchedule[];
}

export default function Schedule({schedule}: ScheduleProps){

  const navigate = useNavigate();

  //export option states
  const [open, setOpen] = useState<boolean>(false);

  const [exportMode, setExportMode] = useState<'all' | 'single'>('all');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  return(
   <div className={s.scheduleContainer}>
    <div className={s.leaveBtnContainer}>
      <ArrowLeftFromLine
        className={s.icon}
        onClick={() => navigate('/create-schedule')}
      />
    </div>

    {schedule.map((clss) => (
      <div className={s.classContainer} key={clss.classroom}>
      <div className={s.tableHeader}>
        <h1 className={s.title}>{clss.classroom}</h1>
        <span className={s.line}></span>
        <div className={s.btnContainer}>
          <button className={s.btn}>
            <FileDown onClick={() => 
              {setOpen(true); setExportMode('single'); setSelectedClass(clss.classroom);}} className={s.icon}/>
          </button>
        </div>
      </div>
      <div>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr className={s.tr}>
                <th className={s.th}>Saat</th>
                <th className={s.th}>Pazartesi</th>
                <th className={s.th}>Salı</th>
                <th className={s.th}>Çarşamba</th>
                <th className={s.th}>Perşembe</th>
                <th className={s.th}>Cuma</th>
              </tr>
            </thead>

            <tbody>
              {Array.from({ length: HOUR_COUNT }).map((_, hourIndex) => (
                <tr key={hourIndex} className={s.tr}>
                  <th className={s.th}>{hourIndex + 1}</th>

                  {Array.from({ length: DAYS_COUNT }).map((_, dayIndex) => {
                    const lessonIndex =
                      dayIndex * HOUR_COUNT + hourIndex;
                    const lesson = clss.lessons[lessonIndex];

                    return (
                      <td key={dayIndex} className={s.td}>
                        {lesson ? (
                          <>
                            <div className={s.tableProf}>
                              {lesson.name}
                            </div>
                            <div className={s.tableLesson}>{lesson.branch}</div>
                          </>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={s.tableWrap}>
          <table className={s.table}>
          <thead>
            <tr className={s.tr}>
              <th className={s.th}>Dersin Adı</th>
              <th className={s.th}>Öğretmen</th>
              <th className={s.th}>H.D.S</th>
            </tr>
          </thead>

          <tbody>
            {clss.teachers.map((t) => (
              <tr key={t.name} className={s.tr}>
                <td className={s.td}>{t.branch}</td>
                <td className={s.td}>{t.name}</td>
                <td className={s.td}>{t.totalClasses}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
      </div>
    ))}

    {open && (
      <Modal confirmText={'İptal et'} cancelText='Dışarı aktar' onConfirm={() => setOpen(false)} onCancel={() => {
      if (exportMode === 'all') {
        exportSchedule(schedule);
      } else {
        const selected = schedule.find(c => c.classroom === selectedClass);

        if(selected){
          exportSchedule([selected]);
        }
      }
      setOpen(false);
    }}>
        <div className={s.modalContainer}>

          <p>Hangi sınıfları dışarı aktarmak istiyorsunuz?</p>

          <div className={s.options}>

            <label className={s.label}>
              <input type="radio" checked={exportMode === 'single'} onChange={() => setExportMode('single')}/> 
              <div className={s.radioCircle}>
                <div className={s.radioDot}>
                </div>
              </div> Sadece bu sınıf
            </label>

            <label className={s.label}>
              <input type="radio" checked={exportMode === 'all'} onChange={() => setExportMode('all')}/>
              <div className={s.radioCircle}>
                <div className={s.radioDot}>
                </div>
              </div> Tüm sınıflar
            </label>

          </div>
        </div>
      </Modal>
    )}
  </div>
  )
}

// might need to go over how the day/hour indexing works