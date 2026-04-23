import { useEffect, useState } from 'react';
import { fetchSchedule } from '../services/fetchSchedule';
import type { ClassroomSchedule } from '../types';

export function useSchedule(id: string | undefined) {
  const [schedule, setSchedule] = useState<ClassroomSchedule[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const data = await fetchSchedule(id);
        if (data.data?.schedule) {
          setSchedule(data.data.schedule);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  return { schedule, loading };
}