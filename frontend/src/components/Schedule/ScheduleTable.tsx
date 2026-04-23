import type { ClassroomSchedule } from '../../types';
import s from '../../style/Schedule.module.css';

const HOUR_COUNT = 8;
const DAYS_COUNT = 5;

type ScheduleTableProps = {
  clss: ClassroomSchedule;
}

export default function ScheduleTable({ clss }: ScheduleTableProps) {
  return (
    <div className={`${s.tableWrap} ${s.mainTable}`}>
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
                const lesson = clss.lessons[dayIndex * HOUR_COUNT + hourIndex];
                return (
                  <td key={dayIndex} className={s.td} aria-label={lesson ? undefined : 'Boş'}>
                    {lesson ? (
                      <>
                        <div className={s.tableProf}>{lesson.name}</div>
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
  );
}