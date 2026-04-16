import './App.css';
import ScheduleBuilder from './components/ScheduleBuilder';
import Schedule from './components/Schedule';
import Footer from './components/Footer';
import Toast from './components/Toast';
import {Routes, Route} from 'react-router-dom';
import { useState } from 'react';
import ScheduleList from './components/ScheduleList';

function App() {
  const [toast, setToast] = useState<boolean>(false);

  const builderElement = (
    <div className="pageContainer">
      <ScheduleList />
      <ScheduleBuilder
        onScheduleCreated={() => {
          setToast(true);
        }}
      />
    </div>
  );

  return (
    <div className='page'>
      <div className="main">
        <Routes>
          <Route
            path='/'
            element={builderElement}
          />
          <Route
            path='/create-schedule'
            element={builderElement}> 
          </Route>
          <Route
            path='/schedule/:id'
            element={ 
              <Schedule  />
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
      <div className="footer">
        <Footer />
      </div>
    </div>
  )
}
export default App;
