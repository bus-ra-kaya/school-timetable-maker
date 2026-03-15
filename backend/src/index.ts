import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { env } from 'node:process';

const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: process.env.URL,
  methods: ['GET', 'POST'],
}))

app.use(express.json());

app.get('/api/program', (req, res) => {
  res.status(200).json({result: true, data: tempdata, error: null});
});

app.post('/api/create-program', (req, res) => {
  const {teachers, classes} = req.body;

  res.status(200).json({result: true, data: tempdata, error: null});
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

const tempdata = [
  { branch: 'Türkçe', name: 'Ayşe Karaca' },
  { branch: 'Türkçe', name: 'Ayşe Karaca' },
  { branch: 'Matematik', name: 'Burak Yıldız' },
  { branch: 'Matematik', name: 'Burak Yıldız' },
  { branch: 'Resim', name: 'Zeynep Polat' },
  { branch: 'Müzik', name: 'Emre Aksoy' },
  { branch: 'Fen Bilgisi', name: 'Selin Çetin' },
  { branch: 'Satranç', name: 'Onur Güneş' },
  { branch: 'İngilizce', name: 'Deniz Acar' },
  { branch: 'İngilizce', name: 'Deniz Acar' },
  { branch: 'Matematik', name: 'Burak Yıldız' },
  { branch: 'Fen Bilgisi', name: 'Selin Çetin' },
  { branch: 'Fen Bilgisi', name: 'Selin Çetin' },
  { branch: 'Beden Eğitimi', name: 'Kaan Demirtaş' },
  { branch: 'Müzik', name: 'Emre Aksoy' },
  { branch: 'Resim', name: 'Zeynep Polat' },
  { branch: 'Matematik', name: 'Burak Yıldız' },
  { branch: 'Matematik', name: 'Burak Yıldız' },
  { branch: 'Türkçe', name: 'Ayşe Karaca' },
  { branch: 'İngilizce', name: 'Deniz Acar' },
  { branch: 'İngilizce', name: 'Deniz Acar' },
  { branch: 'Fen Bilgisi', name: 'Selin Çetin' },
  { branch: 'Satranç', name: 'Onur Güneş' },
  { branch: 'Beden Eğitimi', name: 'Kaan Demirtaş' },
  { branch: 'Türkçe', name: 'Ayşe Karaca' },
  { branch: 'Matematik', name: 'Burak Yıldız' },
  { branch: 'Matematik', name: 'Burak Yıldız' },
  { branch: 'İngilizce', name: 'Deniz Acar' },
  { branch: 'Resim', name: 'Zeynep Polat' },
  { branch: 'Fen Bilgisi', name: 'Selin Çetin' },
  { branch: 'Fen Bilgisi', name: 'Selin Çetin' },
  { branch: 'Müzik', name: 'Emre Aksoy' },
  { branch: 'İngilizce', name: 'Deniz Acar' },
  { branch: 'Türkçe', name: 'Ayşe Karaca' },
  { branch: 'Türkçe', name: 'Ayşe Karaca' },
  { branch: 'Matematik', name: 'Burak Yıldız' },
  { branch: 'Beden Eğitimi', name: 'Kaan Demirtaş' },
  { branch: 'Beden Eğitimi', name: 'Kaan Demirtaş' },
  { branch: 'Satranç', name: 'Onur Güneş' },
  { branch: 'Müzik', name: 'Emre Aksoy' }
];