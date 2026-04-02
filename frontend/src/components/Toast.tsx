import {useState, useEffect} from 'react';
import s from '../style/Toast.module.css';

type ToastProps = {
  message: string;
  type?:'info' | 'error';
  duration? : number;
  onClose: () => void;
}

export default function Toast({message, type = 'error', duration = 3000, onClose}: ToastProps){

  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = 50;
    const step = (interval / duration) * 100;
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0){
          clearInterval(timer);
          return 0;
        }
        return prev - step <= 0 ? 0 : prev - step;
      })
    }, interval);


    return () => clearInterval(timer);

  }, [duration]);

  useEffect(() => {
    if (progress === 0) {
      onClose();
    }
  }, [progress, onClose]);

  return (
    <div
      role={type == 'error' ? 'alert' : 'status'}
      aria-atomic='true'
      className={`${s.toastContainer} ${type === 'error' ? s.error : s.info}`}
    >
      <button
        onClick={onClose}
        aria-label='Bildirimi kapat'
        type='button'
        className={s.exitBtn}
      >
        X
      </button>
      {message}
      <div 
        aria-hidden='true' 
        className={s.toastLine} 
        style={{width: `${progress}%`}}
      ></div>
    </div>
  )
}
