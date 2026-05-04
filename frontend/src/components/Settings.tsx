import { Settings2, X } from "lucide-react";
import s from '../style/Settings.module.css';
import React, {useState } from "react";
import { updateSettings } from "../services/updateSettings";
import Toast from "./Toast";

type Props = {
  setMaxHours: React.Dispatch<React.SetStateAction<number>> ,
  maxHours: number,
  fetching: boolean
}

export default function Settings({setMaxHours, maxHours,fetching}: Props) {

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [toast, setToast] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'error' | 'info'>('error');

  const handleSave = async () => {
    try {
      setLoading(true);
      const data = await updateSettings(maxHours);
      if (data.data) {
        setMaxHours(data.data);
        setToastType('info');
        setToast('Ayarlar başarıyla güncellendi.');
      }
      setOpen(false);
    } catch (err) {
      console.error(err);
      setToastType('error');
      setToast('Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleInvalidInput = () => {
    setToastType('error');
    setToast('Sistem öğretmen başına haftalık en fazla 32 saat ders olacak şekilde tasarlanmıştır.');
  }

  return (
    <>
      <button className={s.settings} onClick={() => setOpen(true)}>
        <Settings2 />
      </button>

      {open && (
        <div className={s.overlay} onClick={() => setOpen(false)}>

          {fetching 
          ? ( <> Yükleniyor... </>) 
          : (
            <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.header}>
              <span>Ayarlar</span>
              <button className={s.closeBtn} onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            <div className={s.body}>
              <div className={s.settingRow}>
                <label>
                  Öğretmen başına en fazla ders saati:
                </label>
                <input 
                  type="number" 
                  min={1}
                  max={32}
                  value={maxHours}
                  onChange={e => {
                    const value = Number(e.target.value);
                    if (value >= 0 && value <= 32) {
                      setMaxHours(value);
                    }
                    else{
                      handleInvalidInput();
                    }
                  }}
                  />
              </div>
            </div>

            <div className={s.footer}>
              <button className={s.cancelBtn} onClick={() => setOpen(false)}>
                İptal
              </button>
              <button className={s.saveBtn} onClick={handleSave}>
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
          )}
        </div>
      )}

      {toast && (
        <Toast
          message={toast}
          type={toastType}
          onClose={() => {setToast(null);}}
        />
      )}
    </>
  )
}