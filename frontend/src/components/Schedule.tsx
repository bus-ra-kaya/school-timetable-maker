import {ArrowLeftFromLine} from 'lucide-react';
import type { ClassroomSchedule } from '../types';
import { useNavigate } from 'react-router-dom';
import s from '../style/Schedule.module.css';

const HOUR_COUNT = 8;
const DAYS_COUNT = 5;

type ScheduleProps = {
  schedule: ClassroomSchedule[];
}

export default function Schedule({schedule}: ScheduleProps){

  const navigate = useNavigate();

  return(
   <div className={s.scheduleContainer}>
    <div className={s.btnContainer}>
      <ArrowLeftFromLine
        className={s.icon}
        onClick={() => navigate('/create-schedule')}
      />
    </div>

    {schedule.map((clss) => (
      <>
      <div className={s.tableHeader}>
          <h1 className={s.title}>{clss.classroom}</h1>
          <span className={s.line}></span>
        </div>
      <div key={clss.classroom}>
        <div>
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
      </div>
      </>
    ))}
  </div>
  )
}

// might need to go over how the day/hour indexing works