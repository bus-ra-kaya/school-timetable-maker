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
      if(res.error){
        setError(res.error);
      }
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
    <main aria-label='Kaydedilmiş programlar'>
      <div className={s.listContainer} >
        <h2> Son kaydedilmiş programlar:</h2>
        <div>
          <div className={s.cardList}>
            {data?.map((item) => {
              const dateLabel = new Date(item.createdAt).toLocaleString('tr-TR');
              return (
              <button 
                key={item.id} 
                aria-label={`${dateLabel} tarihli programı görüntüle`}
                className={s.card}  
                onClick={() => navigate(`/schedule/${item.id}`)}
              >
                <FileText aria-hidden='true' />
                <div>
                    <span className={s.date}>{dateLabel}</span> tarihli program
                </div>
              </button>
            )})}
            {listLoading && (
              <p role='status' aria-live='polite'> Yükleniyor...</p>
            )}
            {!listLoading && Array.isArray(data) && data.length === 0 && (
              <p className={s.placeholder} aria-live='polite'>
                Sistemde kayıtlı program bulunmamaktadır.
              </p>
            )}
            {!listLoading && !data && !error && (
              <p className={s.placeholder}>Veri alınamadı.</p>
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
    </main>
  )
}