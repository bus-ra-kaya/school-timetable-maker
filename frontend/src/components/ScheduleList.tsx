import { FileText } from 'lucide-react';
import s from '../style/ScheduleList.module.css';
import { fetchScheduleLists, type ReturnValue } from '../services/fetchScheduleList';
import { useEffect, useState } from 'react';
import Toast from './Toast';
import { useNavigate } from 'react-router-dom';

export default function ScheduleList() {
  
  const [data, setData] = useState<ReturnValue["data"]>(null);
  const [error, setError] = useState<string | null>(null);
  const [listLoading, setListLoading] = useState<boolean>(true);

  useEffect(() => {
  const load = async () => {
    try {
      const res = await fetchScheduleLists();
      setData(res.data);
    } catch (err) {
      setError('Kaydedilmiş programlar yüklenirken sistemsel bir hata yaşandı.');
      console.error(err);
    } finally {
      setListLoading(false);
    }
  };

  load();
}, []);

  const navigate = useNavigate();

  return (
    <div>
      <div className={s.listContainer} >
        <header> Son kaydedilmiş programlar:</header>
        <div>
          <div className={s.cardList}>
            {data?.map((item) => (
              <button key={item.id} className={s.card}  onClick={() => {
              navigate(`/schedule/${item.id}`);
            }}>
                <FileText />
                <div>
                    <span className={s.date}> {new Date(item.createdAt).toLocaleString("tr-TR")} </span> tarihli program
                </div>
              </button>
            ))}
            {listLoading && (
              <p>Yükleniyor...</p>
            )}
            {!listLoading && Array.isArray(data) && data.length === 0 && (
              <p className={s.placeholder}>Sistemde kayıtlı program bulunmamaktadır.</p>
            )}
          </div>
        </div>
      </div>
      {error && (
              <Toast
                message={error}
                onClose={() => setError(null)}
              />
            )}
    </div>
  )
}