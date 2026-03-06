import 'dotenv/config';
import express from 'express';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.get('/api/timetable', (req, res) => {});

app.post('/api/timetable', (req, res) => {
  const {teachers, classes} = req.body;
  res.status(200).json({data: tempdata});
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

const tempdata = [[
    { class: 'Türkçe', teacher: 'Ayşe Karaca' },
    { class: 'Türkçe', teacher: 'Ayşe Karaca' },
    { class: 'Matematik', teacher: 'Burak Yıldız' },
    { class: 'Matematik', teacher: 'Burak Yıldız' },
    { class: 'Resim', teacher: 'Zeynep Polat' },
    { class: 'Müzik', teacher: 'Emre Aksoy' },
    { class: 'Fen Bilgisi', teacher: 'Selin Çetin' },
    { class: 'Satranç', teacher: 'Onur Güneş' }
  ],
  [
    { class: 'İngilizce', teacher: 'Deniz Acar' },
    { class: 'İngilizce', teacher: 'Deniz Acar' },
    { class: 'Matematik', teacher: 'Burak Yıldız' },
    { class: 'Fen Bilgisi', teacher: 'Selin Çetin' },
    { class: 'Fen Bilgisi', teacher: 'Selin Çetin' },
    { class: 'Beden Eğitimi', teacher: 'Kaan Demirtaş' },
    { class: 'Müzik', teacher: 'Emre Aksoy' },
    { class: 'Resim', teacher: 'Zeynep Polat' }
  ],
  [
    { class: 'Matematik', teacher: 'Burak Yıldız' },
    { class: 'Matematik', teacher: 'Burak Yıldız' },
    { class: 'Türkçe', teacher: 'Ayşe Karaca' },
    { class: 'İngilizce', teacher: 'Deniz Acar' },
    { class: 'İngilizce', teacher: 'Deniz Acar' },
    { class: 'Fen Bilgisi', teacher: 'Selin Çetin' },
    { class: 'Satranç', teacher: 'Onur Güneş' },
    { class: 'Beden Eğitimi', teacher: 'Kaan Demirtaş' }
  ],
  [
    { class: 'Türkçe', teacher: 'Ayşe Karaca' },
    { class: 'Matematik', teacher: 'Burak Yıldız' },
    { class: 'Matematik', teacher: 'Burak Yıldız' },
    { class: 'İngilizce', teacher: 'Deniz Acar' },
    { class: 'Resim', teacher: 'Zeynep Polat' },
    { class: 'Fen Bilgisi', teacher: 'Selin Çetin' },
    { class: 'Fen Bilgisi', teacher: 'Selin Çetin' },
    { class: 'Müzik', teacher: 'Emre Aksoy' }
  ],
  [
    { class: 'İngilizce', teacher: 'Deniz Acar' },
    { class: 'Türkçe', teacher: 'Ayşe Karaca' },
    { class: 'Türkçe', teacher: 'Ayşe Karaca' },
    { class: 'Matematik', teacher: 'Burak Yıldız' },
    { class: 'Beden Eğitimi', teacher: 'Kaan Demirtaş' },
    { class: 'Beden Eğitimi', teacher: 'Kaan Demirtaş' },
    { class: 'Satranç', teacher: 'Onur Güneş' },
    { class: 'Müzik', teacher: 'Emre Aksoy' }
  ]];

