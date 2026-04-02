import { useEffect, useRef } from 'react';
import { Minus, Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import { getRandomName } from '../../utils/getRandomName';
import type { TeacherData } from '../../types';
import s from '../../style/Form.module.css';

type ProfBranchFormProps = {
  teachers: TeacherData[];
  setTeachers: React.Dispatch<React.SetStateAction<TeacherData[]>>;
};

export default function ProfBranchForm({ setTeachers, teachers }: ProfBranchFormProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const removeButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const prevLengthRef = useRef(teachers.length);

  useEffect(() => {
    const lastRow = containerRef.current?.lastElementChild as HTMLElement;
    lastRow?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [teachers.length]);

  useEffect(() => {
    const prevLength = prevLengthRef.current;
    const currentLength = teachers.length;

    if (currentLength < prevLength) {
      const lastId = teachers.at(-1)?.id;
      const target =
        (lastId && removeButtonRefs.current.get(lastId)) ||
        addButtonRef.current;
      target?.focus();
    }

    prevLengthRef.current = currentLength;
  }, [teachers]);

  const addRow = () => {
    setTeachers(prev => [...prev, { id: nanoid(), name: '', branch: '' , placeholder: getRandomName()}]);
  };

  const removeRow = (id: string) => {
    setTeachers(prev => (prev.length > 1 ? prev.filter(row => row.id !== id) : prev));
  };

  const updateRow = (id: string, field: 'name' | 'branch', value: string) => {
    setTeachers(prev =>
      prev.map(row => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const branches = [
    'Türkçe', 'Matematik', 'İngilizce', 'Beden Eğitimi',
    'Resim', 'Müzik', 'Hayat Bilgisi', 'Fen Bilgisi', 'Satranç',
  ];

  return (
    <>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {`${teachers.length} satır`}
      </div>
      <div className={s.header}>
        <span>Öğretmenler: </span>
          <button
            type='button'
            onClick={addRow} 
            className={s.btn}
            aria-label='Yeni satır ekle'
            ref={addButtonRef}>
            <Plus aria-hidden='true'
            />
          </button>
      </div>
      <div ref={containerRef} className={s.formContainer}>
        {teachers.map(row => (
          <fieldset key={row.id} className={s.fieldset}>
            <legend className="sr-only">
              {row.name || 'Yeni öğretmen'}
              {row.branch && ` - ${row.branch}`}
            </legend>

            <label htmlFor={`name-${row.id}`} className='sr-only'>Öğretmen Adı:</label>
            <input
              type="text"
              id={`name-${row.id}`}
              className={s.teacherInput}
              value={row.name}
              placeholder={row.placeholder}
              onChange={e => updateRow(row.id, 'name', e.target.value)}
            />

            <label htmlFor={`branch-${row.id}`} className="sr-only">Branş</label>
            <select
              id={`branch-${row.id}`}
              value={row.branch}
              onChange={e => updateRow(row.id, 'branch', e.target.value)}
            >
              <option value="" disabled>Branş seçiniz</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => removeRow(row.id)}
              className={s.btn}
              aria-label={ `${row.name || 'Yeni öğretmen'} ${row.branch ? row.branch : ''} satırını sil`}
              disabled={teachers.length === 1}
              ref={el => {
                if (el) {
                  removeButtonRefs.current.set(row.id, el);
                } else {
                  removeButtonRefs.current.delete(row.id);
                }
              }}
            >
              <Minus aria-hidden="true" />
            </button>
          </fieldset>
        ))}
      </div>
    </>
  );
}