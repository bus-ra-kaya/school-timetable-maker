import s from '../../style/TableBuilder.module.css';
import {Plus, Minus} from 'lucide-react';
import {nanoid} from 'nanoid';
import type {TeacherData} from '../TableBuilder';

type ProfBranchFormProps = {
  teachers: TeacherData[];
  setTeachers: React.Dispatch<React.SetStateAction<TeacherData[]>>;
}

export default function ProfBranchForm({setTeachers, teachers}: ProfBranchFormProps){

  const addRow = () => {
    setTeachers(prev => [...prev, {id: nanoid(), name: '', branch: ''}])
  };

  const removeRow = (id: string) => {
    setTeachers(prev => (prev.length > 1 ? prev.filter((row) => row.id !== id) : prev));
  };

  const updateRow = (id: string, field: 'name' | 'branch', value: string) => {
    setTeachers(prev =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const branches = ['Türkçe', 'Matematik', 'İngilizce', 'Beden Eğitimi', 'Resim', 'Müzik', 'Hayat Bilgisi', 'Fen Bilgisi', 'Satranç'];

  return (
    <>
      {teachers.map((row) => (
        <div className="field" key={row.id}>
          <label htmlFor={`name-${row.id}`}>Öğretmen Adı: </label>
          <input
            type="text"
            id={`name-${row.id}`}
            value={row.name}
            placeholder="Büşra Kaya"
            onChange={(e) => updateRow(row.id, 'name', e.target.value)}
          />

          <label htmlFor={`branch-${row.id}`} className="sr-only">
            Branş
          </label>
          <select
            id={`branch-${row.id}`}
            value={row.branch}
            onChange={(e) => updateRow(row.id, 'branch', e.target.value)}
          >
            <option value="" disabled>
              Branş seçiniz
            </option>
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={addRow}
            className={s.btn}
            aria-label="Yeni satır ekle"
          >
            <Plus aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => removeRow(row.id)}
            className={s.btn}
            aria-label="Satırı sil"
          >
            <Minus aria-hidden="true" />
          </button>
        </div>
      ))}
    </>
)}