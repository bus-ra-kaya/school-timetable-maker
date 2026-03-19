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
    await prisma.$transaction([
      prisma.classroom.createMany({ data: classes.map(mapClasses) }),
      prisma.teacher.createMany({ data: teachers.map(mapTeachers) }),
    ]);




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
    lessons: [
      { name: "Ali", branch: "TURKCE" },
      { name: "Ayşe", branch: "MATEMATIK" },
      { name: "John", branch: "INGILIZCE" },
      { name: "Kemal", branch: "BEDEN_EGITIMI" },
      { name: "Elif", branch: "RESIM" },
      { name: "Mert", branch: "MUZIK" },
      { name: "Zeynep", branch: "HAYAT_BILGISI" },
      { name: "Ahmet", branch: "FEN_BILGISI" },

      { name: "Ali", branch: "TURKCE" },
      { name: "Ayşe", branch: "MATEMATIK" },
      { name: "John", branch: "INGILIZCE" },
      { name: "Kemal", branch: "BEDEN_EGITIMI" },
      { name: "Elif", branch: "RESIM" },
      { name: "Mert", branch: "MUZIK" },
      { name: "Zeynep", branch: "HAYAT_BILGISI" },
      { name: "Ahmet", branch: "FEN_BILGISI" },

      { name: "Ali", branch: "TURKCE" },
      { name: "Ayşe", branch: "MATEMATIK" },
      { name: "John", branch: "INGILIZCE" },
      { name: "Kemal", branch: "BEDEN_EGITIMI" },
      { name: "Elif", branch: "RESIM" },
      { name: "Mert", branch: "MUZIK" },
      { name: "Zeynep", branch: "HAYAT_BILGISI" },
      { name: "Ahmet", branch: "FEN_BILGISI" },

      { name: "Ali", branch: "TURKCE" },
      { name: "Ayşe", branch: "MATEMATIK" },
      { name: "John", branch: "INGILIZCE" },
      { name: "Kemal", branch: "BEDEN_EGITIMI" },
      { name: "Elif", branch: "RESIM" },
      { name: "Mert", branch: "MUZIK" },
      { name: "Zeynep", branch: "HAYAT_BILGISI" },
      { name: "Ahmet", branch: "FEN_BILGISI" },

      { name: "Ali", branch: "TURKCE" },
      { name: "Ayşe", branch: "MATEMATIK" },
      { name: "John", branch: "INGILIZCE" },
      { name: "Kemal", branch: "BEDEN_EGITIMI" },
      { name: "Elif", branch: "RESIM" },
      { name: "Mert", branch: "MUZIK" },
      { name: "Zeynep", branch: "HAYAT_BILGISI" },
      { name: "Ahmet", branch: "FEN_BILGISI" }
    ]
  },
  {
    classroom: "2-B",
    lessons: [
      { name: "Fatma", branch: "TURKCE" },
      { name: "Mehmet", branch: "MATEMATIK" },
      { name: "Sarah", branch: "INGILIZCE" },
      { name: "Burak", branch: "BEDEN_EGITIMI" },
      { name: "Deniz", branch: "RESIM" },
      { name: "Cem", branch: "MUZIK" },
      { name: "Selin", branch: "FEN_BILGISI" },
      { name: "Kerem", branch: "SATRANC" },

      { name: "Fatma", branch: "TURKCE" },
      { name: "Mehmet", branch: "MATEMATIK" },
      { name: "Sarah", branch: "INGILIZCE" },
      { name: "Burak", branch: "BEDEN_EGITIMI" },
      { name: "Deniz", branch: "RESIM" },
      { name: "Cem", branch: "MUZIK" },
      { name: "Selin", branch: "FEN_BILGISI" },
      { name: "Kerem", branch: "SATRANC" },

      { name: "Fatma", branch: "TURKCE" },
      { name: "Mehmet", branch: "MATEMATIK" },
      { name: "Sarah", branch: "INGILIZCE" },
      { name: "Burak", branch: "BEDEN_EGITIMI" },
      { name: "Deniz", branch: "RESIM" },
      { name: "Cem", branch: "MUZIK" },
      { name: "Selin", branch: "FEN_BILGISI" },
      { name: "Kerem", branch: "SATRANC" },

      { name: "Fatma", branch: "TURKCE" },
      { name: "Mehmet", branch: "MATEMATIK" },
      { name: "Sarah", branch: "INGILIZCE" },
      { name: "Burak", branch: "BEDEN_EGITIMI" },
      { name: "Deniz", branch: "RESIM" },
      { name: "Cem", branch: "MUZIK" },
      { name: "Selin", branch: "FEN_BILGISI" },
      { name: "Kerem", branch: "SATRANC" },

      { name: "Fatma", branch: "TURKCE" },
      { name: "Mehmet", branch: "MATEMATIK" },
      { name: "Sarah", branch: "INGILIZCE" },
      { name: "Burak", branch: "BEDEN_EGITIMI" },
      { name: "Deniz", branch: "RESIM" },
      { name: "Cem", branch: "MUZIK" },
      { name: "Selin", branch: "FEN_BILGISI" },
      { name: "Kerem", branch: "SATRANC" }
    ]
  }
];