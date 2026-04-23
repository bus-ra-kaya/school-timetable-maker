import Modal from '../Modal';
import s from '../../style/ExportModal.module.css';

interface Props {
  mode: 'all' | 'single';
  onModeChange: (mode: 'all' | 'single') => void;
  onExport: () => void;
  onClose: () => void;
}

export default function ExportModal({ mode, onModeChange, onExport, onClose }: Props) {
  return (
    <Modal
      confirmText='İptal et'
      cancelText='Dışarı aktar'
      onConfirm={onClose}
      onCancel={() => { onExport(); onClose(); }}
    >
      <div className={s.modalContainer}>
        <p>Hangi sınıfları dışarı aktarmak istiyorsunuz?</p>
        <div className={s.options}>
          <label className={s.label}>
            <input
              type='radio'
              name='exportMode'
              checked={mode === 'single'}
              onChange={() => onModeChange('single')}
            />
            <div className={s.radioCircle}>
              <div className={s.radioDot} />
            </div>
            Sadece bu sınıf
          </label>
          <label className={s.label}>
            <input
              type='radio'
              name='exportMode'
              checked={mode === 'all'}
              onChange={() => onModeChange('all')}
            />
            <div className={s.radioCircle}>
              <div className={s.radioDot} />
            </div>
            Tüm sınıflar
          </label>
        </div>
      </div>
    </Modal>
  );
}