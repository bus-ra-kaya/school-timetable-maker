import {useState, useEffect} from 'react';

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
        return prev - step;
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
    <div className={`toastContainer ${type}`}>
      {message}
      <div className={`toastLine`} style={{width: `${progress}%`}}></div>
    </div>
  )
}