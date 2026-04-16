import { Router } from 'express';
import { prisma } from '../prisma';
import {isTeacherDataArray, isClassDataArray, hasAllGrades, hasAllTeachers, mapClasses, mapTeachers} from '../services/verifyDataShape';
import { buildSchedule } from '../services/buildSchedule';

const router = Router();

router.post('/api/create-schedule', async (req, res) => { 
  const {teachers, classes} = req.body;

  if (!isTeacherDataArray(teachers)) {
    return res.status(400).json({ error: "Geçersiz öğretmen verisi bulunmaktadır." });
  }

  if (!isClassDataArray(classes)) {
    return res.status(400).json({ error: "Geçersiz sınıf verisi bulunmaktadır." });
  }
  
  if(!hasAllGrades(classes)){
    return res.status(400).json({ error: "Eksik sınıflar bulunmaktadır." });
  }
  if(!hasAllTeachers(teachers)){
    return res.status(400).json({ error: "Eksik öğretmenler bulunmaktadır." });
  }

  try {
    const schedule = await prisma.$transaction(async (tx) => {
      const schedule = await tx.schedule.create({ data: {} });

      await tx.classroom.createMany({
        data: classes.map(c => ({ ...mapClasses(c), scheduleId: schedule.id }))
      });

      await tx.teacher.createMany({
        data: teachers.map(t => ({ ...mapTeachers(t), scheduleId: schedule.id }))
      });

      return schedule;
    }, {timeout: 10000});

    const result = await buildSchedule(schedule.id);

    if (!result?.result) {
      await prisma.lesson.deleteMany({ where: { scheduleId: schedule.id } });
      await prisma.teacher.deleteMany({ where: { scheduleId: schedule.id } });
      await prisma.classroom.deleteMany({ where: { scheduleId: schedule.id } });

      await prisma.schedule.delete({ where: { id: schedule.id } });
      return res.status(500).json({result: false, error: 'Sistemsel bir hata yaşandı. Lütfen daha sonra tekrar deneyiniz.' });
    }
        
    return res.status(200).json({result: true, data: {scheduleId: schedule.id}, error: null });

  } catch (err) {
    console.log(err);
    res.status(500).json({ result: false, error: "Sistemsel bir hata yaşandı. Lütfen daha sonra tekrar deneyiniz." });
  }
});
export default router;