import { useId, useRef, useEffect } from 'react';
import { FocusTrap } from 'focus-trap-react';
import { CircleAlert } from 'lucide-react';
import s from '../style/Modal.module.css';

type ModalProps = {
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function Modal({children, confirmText = 'Evet', cancelText= 'Hayır', onConfirm, onCancel }:ModalProps ){

  const descId = useId();
  const titleId = useId();

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onCancel]);

  return (
    <FocusTrap>
      <div className={s.overlay} onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}>
        <div
          ref={modalRef}
          className={s.modal}
          aria-modal='true'
          tabIndex={-1}
          aria-describedby={descId}
          aria-labelledby ={titleId}
        >
          <CircleAlert aria-hidden='true' />
          <h2 id={titleId} className='sr-only'>Onay gerektiriyor</h2>
          <div id={descId}>{children}</div>
          <div className={s.buttons}>
            <button type='button' onClick={onConfirm}>{confirmText}</button>
            <button type='button' onClick={onCancel}>{cancelText}</button>
          </div>

        </div>
      </div>
    </FocusTrap> 
  )
}