import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftFromLine } from 'lucide-react';
import { useSchedule } from '../../hooks/useSchedule';
import { exportSchedule } from '../../services/exportSchedule';
import ClassSchedule from './ClassSchedule';
import ExportModal from './ExportModal';
import s from '../../style/Schedule.module.css';

export default function Schedule() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { schedule, loading } = useSchedule(id);

  const [open, setOpen] = useState(false);
  const [exportMode, setExportMode] = useState<'all' | 'single'>('all');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  if (loading) return <div>Yükleniyor...</div>;
  if (!schedule) return <div>Program bulunamadı</div>;

  const handleExport = () => {
    if (exportMode === 'all') {
      exportSchedule(schedule);
    } else {
      const selected = schedule.find((c) => c.classroom === selectedClass);
      if (selected) exportSchedule([selected]);
    }
  };

  return (
    <div className={s.scheduleContainer}>
      <div className={s.leaveBtnContainer}>
        <button
          className={s.btn}
          onClick={() => navigate('/create-schedule')}
          aria-label='Geri dön'
        >
          <ArrowLeftFromLine className={s.icon} aria-hidden='true' />
        </button>
      </div>

      {schedule.map((clss) => (
        <ClassSchedule
          key={clss.classroom}
          clss={clss}
          onExportClick={() => {
            setSelectedClass(clss.classroom);
            setExportMode('single');
            setOpen(true);
          }}
        />
      ))}

      {open && (
        <ExportModal
          mode={exportMode}
          onModeChange={setExportMode}
          onExport={handleExport}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}