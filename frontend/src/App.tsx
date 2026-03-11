import './App.css';
import TableBuilder from './components/TableBuilder';
import Timetable from './components/Timetable';
import Footer from './components/Footer';
import Toast from './components/Toast';
import { useState } from 'react';

export type lessonSlot = {
  name: string,
  branch: string,
}

function App() {
  const [view, setView] = useState<'builder' | 'timetable'>('builder');
  const [timetables, setTimetables] = useState<lessonSlot[]>([]);
  const [toast, setToast] = useState<boolean>(false);

  return (
    <div className='page'>
      <div className="main">
        {view === 'builder' && (
        <TableBuilder ifProgramCreated={() => {setView('timetable'); setToast(true);}} setTimeTables={setTimetables}/>
      )}
      {view === 'timetable' && (
        <Timetable onGoBackClick={() => setView('builder')} timetable={timetables} />
      )}
      </div>
      {toast && (
        <Toast
          message='Program başarıyla oluşturuldu.'
          onClose={() => {setToast(false)}}
        />
      )}
      <div className="footer">
        <Footer />
      </div>
    </div>
  )
}

export default App;
