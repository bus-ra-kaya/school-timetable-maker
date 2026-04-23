import type { ClassroomSchedule } from '../../types';
import s from '../../style/Schedule.module.css';

interface Props {
  clss: ClassroomSchedule;
}

export default function TeacherTable({ clss }: Props) {
  return (
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
  );
}