import './App.css';
import ScheduleBuilder from './components/ScheduleBuilder';
import Schedule from './components/Schedule/Schedule';
import Footer from './components/Footer';
import Toast from './components/Toast';
import {Routes, Route} from 'react-router-dom';
import { useEffect, useState } from 'react';
import ScheduleList from './components/ScheduleList';
import Settings from './components/Settings';
import { fetchSettings } from './services/fetchSettings';

function App() {
  const [toast, setToast] = useState<boolean>(false);

  const [maxHours, setMaxHours] = useState<number>(24);
  const [fetching, setFetching] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      try {
        setFetching(true);
        const { data } = await fetchSettings();
        if (data) setMaxHours(data);
      } finally {
        setFetching(false);
      }
    };
    load();
  }, []);

  const builderElement = (
    <div className="pageContainer">
      <ScheduleList />
      <ScheduleBuilder
        onScheduleCreated={() => {
          setToast(true);
        }}
        maxHours={maxHours}
      />
      <Settings maxHours={maxHours} setMaxHours={setMaxHours} fetching={fetching}/>
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
