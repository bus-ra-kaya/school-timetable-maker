import {Plus, Minus} from 'lucide-react';
import {nanoid} from 'nanoid';
import { useState } from 'react';

type Row = {
  id: string
  name: string,
  branch: string
}


export default function ProfBranchForm(){

  const tempRows = [{id: nanoid(), name: '', branch: ''},
    {id: nanoid(), name: '', branch: ''},
    {id: nanoid(), name: '', branch: ''}
  ];

  const [rows, setRows] = useState<Row[]>(tempRows);

  const addRow = () => {
    setRows([...rows, {id: nanoid(), name: '', branch: ''}])
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

  const branches = ['Türkçe', 'Matematik', 'İngilizce', 'Beden Eğitimi', 'Resim', 'Müzik', 'Hayat Bilgisi', 'Fen Bilgisi', 'Satranç'];

  return (
    <>
    {rows.map(row => {
      return (
        <div className="field" key={row.id}>

      <li></li>
      <label htmlFor="name">Öğretmen Adı: </label>

      <input type="text" 
        value={row.name} 
        placeholder="Büşra Kaya" 
        onChange={(e) => { updateRow(row.id, 'name', e.target.value);
      }} />


      <select 
        value={row.branch} 
        onChange={(e) => { updateRow(row.id, 'branch', e.target.value);
      }}>
        <option value="">Branş seçiniz</option>
        {branches.map(branch => {
          return <option key={branch} value={branch}>{branch}</option>
        })}
      </select>

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