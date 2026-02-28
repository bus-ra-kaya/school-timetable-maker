import {useState, useEffect} from 'react';

type ToastProps = {
  message: string;
  type?:'info' | 'error';
  duration? : number;
  onClose: () => void;
}

// not sure if info type is necessary

export default function Toast({message, type = 'error', duration = 5000, onClose}: ToastProps){

  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = 50;
    const step = (interval / duration) * 100;
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0){
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - step;
      })
    }, interval);

    return () => clearInterval(timer);

  }, [onClose, duration])

  return (
    <div className={`toastContainer ${type}`}>
      {message}
      <div className={`toastLine`} style={{width: `${progress}%`}}></div>
    </div>
  )
}