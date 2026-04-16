# Okul Ders Programı Uygulaması

Bu proje, okullar için ders programı oluşturma işlemlerini kolaylaştırmak amacıyla geliştirilmiş bir web uygulamasıdır. Öğretmenler, sınıflar ve dersler arasında çakışma olmadan otomatik program oluşturulmasını sağlar.

<img width="781" height="748" alt="image" src="https://github.com/user-attachments/assets/8b79c9a3-460f-4ec3-9760-7d61f1bb88f6" />


## Kullanım
Öğretmenler, sınıflar ve dersler sisteme eklenir.
“Program oluştur” butonu ile otomatik planlama çalıştırılır.
Oluşturulan program kontrol edilir ve kaydedilir.
Daha önce oluşturulan programlar listeden görüntülenebilir.


## Kullanılan Teknolojiler
- Frontend: React (TypeScript)
- Backend: Node.js / Express
- Veritabanı: PostgreSQL
- ORM: Prisma
  

## API Endpointleri
GET /schedule/ → Id'si girilen programı getirir.
GET /created-schedules → Oluşturulmuş programların idlerini döndür.
POST /create-schedule → Yeni program oluşturur.

## Lisans

MIT
