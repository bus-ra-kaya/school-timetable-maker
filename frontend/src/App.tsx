import './App.css';
import TableBuilder from './components/TableBuilder';
import Timetable from './components/Timetable';
import Footer from './components/Footer';
import { useState } from 'react';

function App() {
  const [view, setView] = useState<'builder' | 'timetable'>('builder');

  return (
    <div className='page'>
      <div className="main">
        {view === 'builder' && (
        <TableBuilder onCreateClick={() => setView('timetable')} />
      )}
      {view === 'timetable' && (
        <Timetable onGoBackClick={() => setView('builder')} />
      )}
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  )
}

export default App;
