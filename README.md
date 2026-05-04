# Okul Ders Programı Uygulaması

Bu proje, okullar için ders programı oluşturma işlemlerini kolaylaştırmak amacıyla geliştirilmiş bir web uygulamasıdır. Öğretmenler, sınıflar ve dersler arasında çakışma olmadan otomatik program oluşturulmasını sağlar.

<img width="781" height="748" alt="image" src="https://github.com/user-attachments/assets/8b79c9a3-460f-4ec3-9760-7d61f1bb88f6" />

## Kurulum

### Repoyu klonla

```bash
git clone https://github.com/bus-ra-kaya/school-timetable-maker
cd school-timetable-maker
```

### Backend kurulumu

- Npm paketlerini kur:

```
cd backend
npm install
```

- Prisma veri tiplerini oluştur.

```
npx prisma generate
```

- backend/.env dosyası oluştur ve şu değişkenleri ekle:

```
PORT=8000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
FRONTEND_URL=http://localhost:5173
```

- backend/src/index.ts dosyasındaki cors origin linkini frontend url si ile değiştir.

- Backendi çalıştır:

```
npm run dev
```

### Frontend kurulumu

- Npm paketlerini indir:

```
cd ../frontend
npm install
```

- Frontend .env dosyasını oluştur:

```
NODE_ENV=development
VITE_API_BASE_URL=http://localhost:8000
```

- Frontendi çalıştır: 

```
npm run dev
```

## Kullanım
Öğretmenler, sınıflar ve dersler sisteme eklenir.
“Program oluştur” butonu ile otomatik planlama çalıştırılır.
Oluşturulan program kontrol edilir ve kaydedilir.
Daha önce oluşturulan programlar listeden görüntülenebilir ve indirilebilir.


## Kullanılan Teknolojiler
- Frontend: React (TypeScript)
- Backend: Node.js / Express
- Veritabanı: PostgreSQL
- ORM: Prisma
  

## API Endpointleri
GET /schedule/ → Id'si girilen programı getirir.
GET /created-schedules → Oluşturulmuş programların idlerini döndür.
POST /create-schedule → Yeni program oluşturur.

## Backlog

- Yılları ve sınıf sayısını belirleyebilme.
- Dersleri ve ders saatlerini kişiselleştirebilme.
- Uygulama ve pdf üzerinde program ile ilgili daha fazla bilgi bulundurma.


## Lisans

MIT
