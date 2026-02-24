import './App.css';
import TableBuilder from './components/TableBuilder';
import Timetable from './components/Timetable';
import { useState } from 'react';

function App() {
  const [view, setView] = useState<'builder' | 'timetable'>('builder');

  return (
    <>
    {view === 'builder' && (
      <TableBuilder onCreateClick={() => setView('timetable')} />
    )}
     {view === 'timetable' && (
      <Timetable onGoBackClick={() => setView('builder')} />
    )}
    
    </>
  )
}

export default App;
