import s from '../../style/TableBuilder.module.css';
import {Plus, Minus} from 'lucide-react';
import { nanoid} from 'nanoid';
import type {ClassData} from '../TableBuilder';

type ClassFormProps = {
  classes: ClassData[];
  setClasses: React.Dispatch<React.SetStateAction<ClassData[]>>;
}

export default function ClassForm({setClasses, classes}: ClassFormProps){

  const addRow = () => {
    setClasses(prev => [...prev, {id: nanoid(), year: 1, class: ''}])
  };

  const removeRow = (id: string) => {
    setClasses(prev => 
      prev.length > 1 ? prev.filter(row => row.id !== id) : prev);
  }

  const updateRow = (id: string, field: 'year' | 'class', value: number | string) => {
    setClasses(prev => 
      prev.map(row =>
      row.id === id ? {...row, [field]: value} : row)
    );
  }

  const years = [1,2,3,4,5,6,7,8,9,10,11,12];

  return (
    <>
    {classes.map(row => (
        <div className="field" key={row.id}>
           <label htmlFor={`year-${row.id}`}>Sınıfı: </label>
          <select
            id={`year-${row.id}`}
            value={row.year} 
            onChange={(e) => { updateRow(row.id, 'year', Number(e.target.value));
          }}>

            <option value={0} disabled>Yıl seçiniz</option>
            {years.map(year => <option key={year} value={year}>{year}</option> )}
          </select>

          <label htmlFor={`class-${row.id}`} className='sr-only'>Şube</label>
          <input type="text" 
            id={`class-${row.id}`}
            value={row.class} 
            placeholder="A" 
            onChange={(e) => { updateRow(row.id, 'class', e.target.value);
          }} />

          <button
            type='button'
            onClick={addRow} 
            className={s.btn}
            aria-label='Yeni satır ekle'>
            <Plus aria-hidden='true'/>
          </button>
          <button 
            type='button'
            onClick={() => removeRow(row.id)} 
            className={s.btn}
            aria-label='Satırı sil'>
            <Minus aria-hidden='true' />
          </button>
       </div>
      ))}
    </>
  )
}

// not sure if adding fieldsets would be a good idea
// perhaps keep only one button for adding more rows?