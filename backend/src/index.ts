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
import { dayMap } from './data/subjects';

const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: process.env.URL,
  methods: ['GET', 'POST'],
}))

app.use(express.json());

app.get('/api/created-schedules', async (req, res) => {
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
})

app.post('/api/schedule', async (req, res) => {

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

    const hours = 8;
    const days = 5;
    const formatted = scheduleData?.classrooms.map((classroom) => {
      const teacherMap: Record<string, { name: string; branch: string; totalClasses: number}> = {};

      const lessons = Array(hours * days).fill(null);

      for(const lesson of classroom.lessons) {
        const t = lesson.teacher;

        if(!teacherMap[t.id]) {
          teacherMap[t.id] = {
            name: t.name,
            branch: t.branch,
            totalClasses: 0,
          }
        }
        teacherMap[t.id].totalClasses += 1;

      const dayIndex = dayMap[lesson.day];
      const hourIndex = lesson.hour -1;

      const index = (dayIndex * hours) + hourIndex;

      lessons[index] = {
      name: t.name,
      branch: t.branch,
      };
    }
      return {
        classroom: classroom.name,
        teachers: Object.values(teacherMap),
        lessons,
      };
    })
        
    return res.status(200).json({result: true, data: {schedule: formatted, scheduleId: scheduleId}, error: null });
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
    }, {timeout: 10000});

    const result = await buildSchedule(schedule.id);

    if (!result) {
      await prisma.lesson.deleteMany({ where: { scheduleId: schedule.id } });
      await prisma.teacher.deleteMany({ where: { scheduleId: schedule.id } });
      await prisma.classroom.deleteMany({ where: { scheduleId: schedule.id } });

      await prisma.schedule.delete({ where: { id: schedule.id } });
      return res.status(500).json({result: false, error: 'Sistemsel bir hata yaşandı. Lütfen daha sonra tekrar deneyiniz.' });
    }

    const scheduleData = await prisma.schedule.findUnique({
      where: { id: schedule.id },
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

    const hours = 8;
    const days = 5;
    const formatted = scheduleData?.classrooms.map((classroom) => {
      const teacherMap: Record<string, { name: string; branch: string; totalClasses: number}> = {};

      const lessons = Array(hours * days).fill(null);

      for(const lesson of classroom.lessons) {
        const t = lesson.teacher;

        if(!teacherMap[t.id]) {
          teacherMap[t.id] = {
            name: t.name,
            branch: t.branch,
            totalClasses: 0,
          }
        }
        teacherMap[t.id].totalClasses += 1;

      const dayIndex = dayMap[lesson.day];
      const hourIndex = lesson.hour -1;

      const index = (dayIndex * hours) + hourIndex;

      lessons[index] = {
      name: t.name,
      branch: t.branch,
      };
    }
      return {
        classroom: classroom.name,
        teachers: Object.values(teacherMap),
        lessons,
      };
    })
        
    return res.status(200).json({result: true, data: {schedule: formatted, scheduleId: schedule.id}, error: null });

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
