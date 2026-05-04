import { Router } from 'express';
import schedules from './schedules.js';
import createSchedule from './createSchedule.js';
import settings from './settings.js';

const router = Router();
router.get('/health', (_, res) => res.json({ ok: true }));
router.use(schedules);
router.use(createSchedule);
router.use(settings);
export default router;