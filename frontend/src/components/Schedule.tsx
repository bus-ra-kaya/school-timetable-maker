import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftFromLine, FileDown } from 'lucide-react';
import Modal from './Modal';
import { exportSchedule } from '../services/exportSchedule';
import s from '../style/Schedule.module.css';
import type { ClassroomSchedule } from '../types';
import { fetchSchedule } from '../services/fetchSchedule';


const HOUR_COUNT = 8;
const DAYS_COUNT = 5;

export default function Schedule(){

  const navigate = useNavigate();
  const { id } = useParams();

  const [schedule, setSchedule] = useState<ClassroomSchedule[] | null>(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  if (!id) return;

  const load = async () => {
    try {
      const data = await fetchSchedule(id);
      if (data.data?.schedule) {
        setSchedule(data.data.schedule);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  load();
}, [id]);

  //export option states
  const [open, setOpen] = useState<boolean>(false);

  const [exportMode, setExportMode] = useState<'all' | 'single'>('all');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  if (loading) return <div>Yükleniyor...</div>;
  if(!schedule) return <div>Program bulunamadı</div>

  return(
   <div className={s.scheduleContainer}>
    <div className={s.leaveBtnContainer}>
      <button className={s.btn} 
        onClick={() => navigate('/create-schedule')}
        aria-label='Geri dön'>
        <ArrowLeftFromLine className={s.icon} aria-hidden='true' />
      </button>
    </div>

    {schedule.map((clss) => (
      <div className={s.classContainer} key={clss.classroom}>
      <div className={s.tableHeader}>
        <h1 className={s.title}>{clss.classroom}</h1>
        <span className={s.line}></span>
        <div className={s.btnContainer}>
          <button className={s.btn}
            aria-label='Programı dışarı aktar'
            onClick={() => 
              {setOpen(true); setExportMode('single'); setSelectedClass(clss.classroom);}}>
            <FileDown
              className={s.icon}
              aria-hidden='true'/>
          </button>
        </div>
      </div>
      <div>
        <div className={s.tableWrap}>
          <table className={s.table} aria-label={`${clss.classroom} ders programı`}>
            <thead>
              <tr className={s.tr}>
                <th className={s.th} scope='col'>Saat</th>
                <th className={s.th} scope='col'>Pazartesi</th>
                <th className={s.th} scope='col'>Salı</th>
                <th className={s.th} scope='col'>Çarşamba</th>
                <th className={s.th} scope='col'>Perşembe</th>
                <th className={s.th} scope='col'>Cuma</th>
              </tr>
            </thead>

            <tbody>
              {Array.from({ length: HOUR_COUNT }).map((_, hourIndex) => (
                <tr key={hourIndex} className={s.tr}>
                  <th className={s.th} scope='row'>{hourIndex + 1}</th>

                  {Array.from({ length: DAYS_COUNT }).map((_, dayIndex) => {
                    const lessonIndex =
                      dayIndex * HOUR_COUNT + hourIndex;
                    const lesson = clss.lessons[lessonIndex];

                    return (
                      <td key={dayIndex} className={s.td} aria-label={lesson ? undefined : 'Boş'}>
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
          <table className={s.table} aria-label={`${clss.classroom} öğretmen listesi`}>
          <thead>
            <tr className={s.tr}>
              <th className={s.th} scope='col'>Dersin Adı</th>
              <th className={s.th} scope='col'>Öğretmen</th>
              <th className={s.th} scope='col' title='Haftalık ders saati'>H.D.S</th>
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
              <input type="radio" name='exportMode' checked={exportMode === 'single'} onChange={() => setExportMode('single')}/> 
              <div className={s.radioCircle}>
                <div className={s.radioDot}>
                </div>
              </div> Sadece bu sınıf
            </label>

            <label className={s.label}>
              <input type="radio" name='exportMode' checked={exportMode === 'all'} onChange={() => setExportMode('all')}/>
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

//might need to make sure focus gets returned to the right place once the modal closes
// might need to go over how the day/hour indexing works