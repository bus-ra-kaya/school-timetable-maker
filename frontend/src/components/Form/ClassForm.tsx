import s from '../../style/TableBuilder.module.css';
import type {ClassData} from '../../types';
import {Plus, Minus} from 'lucide-react';
import { useEffect, useRef } from 'react';
import { nanoid} from 'nanoid';

type ClassFormProps = {
  classes: ClassData[];
  setClasses: React.Dispatch<React.SetStateAction<ClassData[]>>;
}

export default function ClassForm({setClasses, classes}: ClassFormProps){

  const containerRef = useRef<HTMLDivElement>(null);
  const removeButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const prevLengthRef = useRef(classes.length);

  useEffect(() => {
    const lastRow = containerRef.current?.lastElementChild as HTMLElement;

    lastRow?.scrollIntoView({behavior: 'smooth', block: 'center'});
  }, [classes, length]);

  useEffect(() => {
    const prevLength = prevLengthRef.current;
    const currentLength = classes.length;

    if (currentLength < prevLength) {
      const lastId = classes.at(-1)?.id;
      const target =
        (lastId && removeButtonRefs.current.get(lastId)) ||
        addButtonRef.current;
      target?.focus();
    }

    prevLengthRef.current = currentLength;
  }, [classes]);

  // need to go over the useEffect above, as well the refs used (i'm not sure if the focus works properly?)(el and ref?)

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
      <div aria-live='polite' aria-atomic='true' className='sr-only'>
           {`${classes.length} satır`}
      </div>

      <div ref={containerRef} className={s.formContainer}>
      {classes.map(row => (

        <fieldset key={row.id} className={s.fieldset}>
          <legend className='sr-only'>
            {row.year} {row.class ? `- ${row.class}` : '. sınıf'}
          </legend>

          <label htmlFor={`year-${row.id}`}>Sınıf: </label>
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
            aria-label='Yeni satır ekle'
            ref={addButtonRef}>
            <Plus aria-hidden='true'
            />
          </button>
          <button 
            type='button'
            onClick={() => removeRow(row.id)} 
            className={s.btn}
            aria-label={`${row.year}. sınıf ${row.class || 'yeni'} satırını sil`}
            disabled={classes.length === 1}
            ref={ el => {
              if (el){
                removeButtonRefs.current.set(row.id, el);
              } else {
                removeButtonRefs.current.delete(row.id);
              }
            }} >
            <Minus aria-hidden='true' />
          </button>

        </fieldset>
        ))}
      </div>
    </>
  )
}

// not sure if adding fieldsets would be a good idea
// perhaps keep only one button for adding more rows?