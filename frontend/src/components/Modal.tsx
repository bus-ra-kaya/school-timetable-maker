import s from '../style/Modal.module.css';
import { useEffect } from 'react';
import { CircleAlert } from 'lucide-react';

type ModalProps = {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function Modal({message, confirmText = 'Evet', cancelText= 'Hayır', onConfirm, onCancel }:ModalProps ){

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if(e.key === 'Escape') {
        onCancel();
      };
    };

    document.addEventListener('keydown', handleEscape);

    return(() => {
      document.addEventListener('keydown', handleEscape);
    })

  }, [onCancel]);

  return (
    <div className={s.overlay} onClick={onCancel}>
      <div className={s.modal} onClick={e => e.stopPropagation()}>
        <CircleAlert />
        <p>{message}</p>
        <div className={s.buttons}>
          <button onClick={onConfirm}>{confirmText}</button>
          <button onClick={onCancel}>{cancelText}</button>
        </div>
      </div>
    </div>
  )
}