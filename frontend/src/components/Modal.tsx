import s from '../style/Modal.module.css';

type ModalProps = {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function Modal({message, confirmText = 'Evet', cancelText= 'Hayır', onConfirm, onCancel }:ModalProps ){

  return (
    <div className={s.overlay} onClick={onCancel}>
      <div className={s.modal} onClick={e => e.stopPropagation()}>
        <p>{message}</p>
        <div className={s.buttons}>
          <button onClick={onConfirm}>{confirmText}</button>
          <button>{cancelText}</button>
        </div>
      </div>
    </div>
  )
}