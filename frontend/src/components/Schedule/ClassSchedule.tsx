import { FileDown } from 'lucide-react';
import ScheduleTable from './ScheduleTable';
import TeacherTable from './TeacherTable';
import type { ClassroomSchedule } from '../../types';
import s from '../../style/Schedule.module.css';

interface Props {
  clss: ClassroomSchedule;
  onExportClick: () => void;
}

export default function ClassSchedule({ clss, onExportClick }: Props) {
  return (
    <div className={s.classContainer}>
      <div className={s.tableHeader}>
        <h1 className={s.title}>{clss.classroom}</h1>
        <span className={s.line} />
        <div className={s.btnContainer}>
          <button
            className={s.btn}
            aria-label='Programı dışarı aktar'
            onClick={onExportClick}
          >
            <FileDown className={s.icon} aria-hidden='true' />
          </button>
        </div>
      </div>

      <ScheduleTable clss={clss} />
      <div className={s.mobileNotice} aria-hidden='true'>
        <span>Ders programını görmek için lütfen daha büyük bir ekran kullanın.</span>
      </div>
      <TeacherTable clss={clss} />
    </div>
  );
}