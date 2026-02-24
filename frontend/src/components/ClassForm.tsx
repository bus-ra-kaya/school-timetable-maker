import {Plus, Minus} from 'lucide-react';
import {nanoid} from 'nanoid';
import { useState } from 'react';

type Row = {
  id: string
  name: string,
  year: number
}


export default function ClassForm(){

  const tempRows = [{id: nanoid(), name: '', year: 1},
    {id: nanoid(), name: '', year: 1},
    {id: nanoid(), name: '', year: 1}
  ];

  const [rows, setRows] = useState<Row[]>(tempRows);

  const addRow = () => {
    setRows([...rows, {id: nanoid(), name: '', year: 1}])
  };

  const removeRow = (index: string) => {
    setRows(rows.filter(row => row.id !== index));
  }

  const updateRow = (id: string, field: 'name' | 'branch', value: string) => {
    setRows(rows => 
      rows.map(row =>
      row.id === id ? {...row, [field]: value} : row)
    );
  }

  const branches = [1,2,3,4,5,6,7,8,9,10,11,12];

  return (
    <>
    {rows.map(row => {
      return (
        <div className="field" key={row.id}>

      <li></li>
      <label htmlFor="name">Sınıfı: </label>
      <select 
        value={row.year} 
        onChange={(e) => { updateRow(row.id, 'branch', e.target.value);
      }}>
        <option value="">Yıl seçiniz</option>
        {branches.map(branch => {
          return <option key={branch} value={branch}>{branch}</option>
        })}
      </select>

       <input type="text" 
        value={row.name} 
        placeholder="A" 
        onChange={(e) => { updateRow(row.id, 'name', e.target.value);
      }} />

      <button onClick={addRow}>
        <Plus />
      </button>
      <button onClick={() => removeRow(row.id)}>
        <Minus />
      </button>
    </div>
      )})}
    </>
  )
}