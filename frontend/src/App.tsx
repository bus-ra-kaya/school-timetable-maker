import './App.css';
import ScheduleBuilder from './components/ScheduleBuilder';
import Schedule from './components/Schedule';
import Footer from './components/Footer';
import Toast from './components/Toast';
import {Routes, Route, Navigate} from 'react-router-dom';
import { useSchedule } from './hooks/useSchedule';
import { useState } from 'react';
import type { ClassroomSchedule } from './types';

function App() {
  const {schedule, isLoading, error, clearError, saveSchedule} = useSchedule();
  const [toast, setToast] = useState<boolean>(false);

  if (isLoading) return <div>Yükleniyor...</div>;

  return (
    <div className='page'>
      <div className="main">
        <Routes>
          <Route
            path='/'
            element={schedule.length > 0
              ? <Navigate to='/schedule' />
              : <Navigate to='/create-schedule' />
            }
          />
          <Route
            path='/create-schedule'
            element={ 
              <ScheduleBuilder onScheduleCreated={(schedule: ClassroomSchedule[]) => {
                saveSchedule(schedule);
                setToast(true);
              }} />} > 
          </Route>
          <Route
            path='/schedule'
            element={ 
              <Schedule schedule={schedule} />
            }>
          </Route>
          <Route path='*' element={<h1>404 - Page Not Found</h1>}></Route>
        </Routes>
      </div>
      {toast && (
        <Toast
          message='Program başarıyla oluşturuldu.'
          type='info'
          onClose={() => {setToast(false)}}
        />
      )}
      {error && (
        <Toast
          message={error}
          onClose={clearError}
        />
      )}
      <div className="footer">
        <Footer />
      </div>
    </div>
  )

}
export default App;
