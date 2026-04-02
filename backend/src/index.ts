import 'dotenv/config';
import express from 'express';
import { hasAllGrades } from './services/hasAllGrades';
import { hasAllTeachers } from './services/hasAllTeachers';
import { mapClasses } from './services/mapClasses';
import { isTeacherDataArray, isClassDataArray } from './services/verifyDataShape';
import cors from 'cors';
import { prisma } from './prisma';
import { mapTeachers } from './services/mapTeachers';

const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: process.env.URL,
  methods: ['GET', 'POST'],
}))

app.use(express.json());

app.get('/api/schedule', (req, res) => {
  res.status(200).json({result: true, data: schedules, error: null});
});

app.post('/api/create-schedule', async (req, res) => {


  res.status(200).json({result: true, data: schedules, error: null});

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
    const result = await prisma.$transaction(async (tx) => {
      const schedule = await tx.schedule.create({
        data: {}
      })


    const scheduleId = schedule.id;

    await tx.classroom.createMany({
      data: classes.map(c => ({
        ...mapClasses(c),
        scheduleId,
      }))
    });

    await tx.teacher.createMany({
      data: teachers.map(t => ({
        ...mapTeachers(t),
        scheduleId,
      }))
    })



    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Sistemsel bir hata yaşandı. Lütfen daha sonra tekrar deneyiniz." });
  }

});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

const schedules = [
  {
    classroom: "1-A",
    teachers: [
      { name: "Ali Yılmaz", branch: "Türkçe", totalClasses: 5 },
      { name: "Ayşe Demir", branch: "Matematik", totalClasses: 5 },
      { name: "Emre Kaya", branch: "İngilizce", totalClasses: 5 },
      { name: "Kemal Arslan", branch: "Beden Eğitimi", totalClasses: 5 },
      { name: "Elif Şahin", branch: "Resim", totalClasses: 5 },
      { name: "Mert Çelik", branch: "Müzik", totalClasses: 5 },
      { name: "Zeynep Koç", branch: "Hayat Bilgisi", totalClasses: 5 },
      { name: "Ahmet Aksoy", branch: "Fen Bilgisi", totalClasses: 5 },
    ],
    lessons: Array(5).fill([
      { name: "Ali Yılmaz", branch: "Türkçe" },
      { name: "Ayşe Demir", branch: "Matematik" },
      { name: "Emre Kaya", branch: "İngilizce" },
      { name: "Kemal Arslan", branch: "Beden Eğitimi" },
      { name: "Elif Şahin", branch: "Resim" },
      { name: "Mert Çelik", branch: "Müzik" },
      { name: "Zeynep Koç", branch: "Hayat Bilgisi" },
      { name: "Ahmet Aksoy", branch: "Fen Bilgisi" }
    ]).flat()
  },
  {
    classroom: "2-B",
    teachers: [
      { name: "Fatma Öztürk", branch: "Türkçe", totalClasses: 5 },
      { name: "Mehmet Kılıç", branch: "Matematik", totalClasses: 5 },
      { name: "Seda Arı", branch: "İngilizce", totalClasses: 5 },
      { name: "Burak Yıldız", branch: "Beden Eğitimi", totalClasses: 5 },
      { name: "Deniz Polat", branch: "Resim", totalClasses: 5 },
      { name: "Cem Tuncer", branch: "Müzik", totalClasses: 5 },
      { name: "Selin Uysal", branch: "Fen Bilgisi", totalClasses: 5 },
      { name: "Kerem Taş", branch: "Satranç", totalClasses: 5 }
    ],
    lessons: Array(5).fill([
      { name: "Fatma Öztürk", branch: "Türkçe" },
      { name: "Mehmet Kılıç", branch: "Matematik" },
      { name: "Seda Arı", branch: "İngilizce" },
      { name: "Burak Yıldız", branch: "Beden Eğitimi" },
      { name: "Deniz Polat", branch: "Resim" },
      { name: "Cem Tuncer", branch: "Müzik" },
      { name: "Selin Uysal", branch: "Fen Bilgisi" },
      { name: "Kerem Taş", branch: "Satranç" }
    ]).flat()
  }
];