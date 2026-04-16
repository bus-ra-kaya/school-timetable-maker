import { Router } from 'express';
import schedules from './schedules';
import createSchedule from './createSchedule';

const router = Router();
router.get('/health', (_, res) => res.json({ ok: true }));
router.use(schedules);
router.use(createSchedule);
export default router;