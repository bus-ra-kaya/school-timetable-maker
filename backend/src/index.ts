import 'dotenv/config';
import express from 'express';
import { hasAllGrades } from './services/hasAllGrades';
import { hasAllTeachers } from './services/hasAllTeachers';
import { mapClasses } from './services/mapClasses';
import { isTeacherDataArray, isClassDataArray } from './services/verifyDataShape';
import cors from 'cors';
import { prisma } from './prisma';
import { mapTeachers } from './services/mapTeachers';
import { buildSchedule } from './services/scheduling/buildSchedule';

const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: process.env.URL,
  methods: ['GET', 'POST'],
}))

app.use(express.json());

app.get('/api/schedule', (req, res) => {
  res.status(200).json({result: true, data: null, error: null});
});

app.post('/api/create-schedule', async (req, res) => {

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
    });

    const {result} = await buildSchedule(schedule.id);

    if (!result) {
      await prisma.lesson.deleteMany({ where: { scheduleId: schedule.id } });
      await prisma.teacher.deleteMany({ where: { scheduleId: schedule.id } });
      await prisma.classroom.deleteMany({ where: { scheduleId: schedule.id } });

      await prisma.schedule.delete({ where: { id: schedule.id } });
      return res.status(500).json({result: false, error: 'Sistemsel bir hata yaşandı. Lütfen daha sonra tekrar deneyiniz.' });
    }

    console.log(result);
    return res.status(200).json({result: true, data: null, error: null });

  } catch (err) {
    console.log(err);
    res.status(500).json({ result: false, error: "Sistemsel bir hata yaşandı. Lütfen daha sonra tekrar deneyiniz." });
  }

});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

/* schedule = [{
  classroom: string,
  teachers: [{name: string, branch: string, totalClasses: number}]  
}]*/