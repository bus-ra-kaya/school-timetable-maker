import './App.css';
import ProgramBuilder from './components/ProgramBuilder';
import Program from './components/Program';
import Footer from './components/Footer';
import Toast from './components/Toast';
import {Routes, Route, Navigate} from 'react-router-dom';
import { useProgram } from './hooks/useProgram';
import { useState } from 'react';
import type { lessonSlot } from './types';

function App() {
  const {program, isLoading, error, clearError, saveProgram} = useProgram();
  const [toast, setToast] = useState<boolean>(false);

  if (isLoading) return <div>Yükleniyor...</div>;

  return (
    <div className='page'>
      <div className="main">
        <Routes>
          <Route
            path='/'
            element={program.length > 0
              ? <Navigate to='/program' />
              : <Navigate to='/create-program' />
            }
          />
          <Route
            path='/create-program'
            element={ 
              <ProgramBuilder onProgramCreated={(program: lessonSlot[]) => {
                saveProgram(program);
                setToast(true);
              }} />} > 
          </Route>
          <Route
            path='/program'
            element={ 
              <Program program={program} />
            }>
          </Route>
          <Route path='*' element={<h1>404 - Page Not Found</h1>}></Route>
        </Routes>
      </div>
      {toast && (
        <Toast
          message='Program başarıyla oluşturuldu.'
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
