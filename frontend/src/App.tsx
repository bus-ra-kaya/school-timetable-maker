import './App.css';
import TableBuilder from './components/TableBuilder';
import Timetable from './components/Timetable';
import Footer from './components/Footer';
import { useState } from 'react';

export type lessonSlot = {
  name: string,
  branch: string,
}

function App() {
  const [view, setView] = useState<'builder' | 'timetable'>('builder');
  const [timetables, setTimetables] = useState<lessonSlot[]| null>(null);

  return (
    <div className='page'>
      <div className="main">
        {view === 'builder' && (
        <TableBuilder ifTableCreated={() => setView('timetable')} setTimeTables={setTimetables}/>
      )}
      {view === 'timetable' && (
        <Timetable onGoBackClick={() => setView('builder')} timetables={timetables} />
      )}
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  )
}

export default App;
