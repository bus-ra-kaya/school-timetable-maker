import { Router } from 'express';
import { prisma } from '../prisma';
import { formatSchedule } from '../utils/formatSchedule';

const router = Router();

router.get('/api/created-schedules', async (req, res) => { 
  try {
    const schedules = await prisma.schedule.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    res.status(200).json({data: schedules});
  } catch (err){
    console.log(err);
    res.status(500).json({error: "Sistemsel bir hata yaşandı. Lütfen daha sonra tekrar deneyiniz." });
  }
});

router.post('/api/schedule', async (req, res) => { 
  
  const {scheduleId} = req.body;

  const scheduleData = await prisma.schedule.findUnique({
      where: { id: scheduleId },
      select: {
        classrooms: {
          select: {
            name: true,
            lessons: {
              select: {
                teacher: {
                  select: {
                    id: true,
                    name: true,
                    branch: true,
                    hours: true,
                  },
                },
                hour: true,
                day: true,
              },
            },
          },
        },
      },
    });

    if(!scheduleData) return res.status(500).json({ result: false, error: "Sistemsel bir hata yaşandı. Lütfen daha sonra tekrar deneyiniz." });

    const formatted = formatSchedule(scheduleData);
        
    return res.status(200).json({result: true, data: {schedule: formatted, scheduleId: scheduleId}, error: null });
});

export default router;