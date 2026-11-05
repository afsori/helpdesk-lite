# HelpDesk Lite — Aturan Proyek

## Tujuan

Aplikasi HelpDesk SaaS multi-tenant sederhana untuk belajar backend. Pemilik proyek adalah
frontend developer (Angular) yang sedang belajar backend: setiap selesai membuat kode, beri
penjelasan singkat (bahasa Indonesia) tentang konsep backend yang dipakai.

## Stack

- **Backend:** Node.js + Express 5 + TypeScript (CommonJS, strict mode).
  Development dijalankan dengan `tsx watch`, build produksi dengan `tsc`.
- **Database:** MySQL lewat paket `mysql2/promise` dengan SQL murni.
  **DILARANG** memakai ORM atau query builder (TypeORM, Prisma, Sequelize, Knex, dll.).
- Database berjalan di **XAMPP** (MariaDB, kompatibel MySQL) di `localhost:3306`, user `root`,
  password kosong. Tidak memakai Docker. Tulis SQL yang kompatibel dengan MySQL dan MariaDB.
- **Auth:** JWT dengan `jsonwebtoken` + middleware buatan sendiri (tanpa Passport).
  Password di-hash dengan `bcryptjs`.
- **Validasi:** `zod`. Skema body memakai `.strict()` sehingga field yang tidak dikenal ditolak (400).
- **Dokumentasi API:** Swagger UI di `/api/docs` (`swagger-ui-express` + `swagger-jsdoc`, anotasi
  `@openapi` di file routes). Semua endpoint diberi prefix `/api`.
- **Keamanan dasar:** `helmet`, `cors` (origin `http://localhost:4200`). Log request: `morgan`.
- **Frontend:** Angular 19, standalone components, signals, RxJS, Tailwind CSS (v4, file style `.css`).
- **TIDAK** membuat file test di backend maupun frontend.

## Domain

| Entitas          | Keterangan |
| ---------------- | ---------- |
| `tenant`         | Organisasi pelanggan SaaS. |
| `user`           | Anggota tenant, peran: `admin` \| `agent` \| `customer`. |
| `ticket`         | Laporan/permintaan bantuan. status: `open` \| `in_progress` \| `pending` \| `resolved` \| `closed`. priority: `low` \| `medium` \| `high` \| `urgent`. |
| `category`       | Kategori tiket per tenant. |
| `ticket_comment` | Komentar tiket, bisa `is_internal` (hanya terlihat admin/agent). |

## Struktur Backend

```
backend/src/
├── server.ts            (hanya menyalakan server: app.listen)
├── app.ts               (membuat app Express: middleware, routes, error handler)
├── config/env.ts        (membaca .env dan memvalidasinya dengan zod)
├── db/                  (pool.ts, schema.sql, migrate.ts, seed.ts)
├── docs/swagger.ts
├── middlewares/         (validate.ts, auth.ts, roles.ts, error-handler.ts, not-found.ts)
├── utils/http-error.ts  (class HttpError dengan statusCode)
├── types/express.d.ts   (menambahkan req.user ke tipe Request)
└── modules/<fitur>/
    ├── <fitur>.routes.ts      (definisi route + middleware + anotasi Swagger)
    ├── <fitur>.controller.ts  (ambil data dari req, panggil service, kirim res)
    ├── <fitur>.service.ts     (logika bisnis & aturan akses)
    ├── <fitur>.repository.ts  (SATU-SATUNYA tempat menulis SQL)
    └── <fitur>.schemas.ts     (skema zod)
```

## Aturan Backend

- Alur: `routes -> controller -> service -> repository`. Controller **TIDAK** menulis SQL;
  repository **TIDAK** tahu soal `req`/`res`.
- Selalu gunakan parameterized query (`?`) — **JANGAN** menyusun SQL dengan menggabungkan string input user.
- Kolom database memakai `snake_case`, response API memakai `camelCase`. Mapping dilakukan di repository.
- **ISOLASI TENANT:** setiap query ke tabel milik tenant **WAJIB** punya `WHERE tenant_id = ?`.
  `tenantId` **SELALU** diambil dari `req.user` (hasil JWT), **TIDAK PERNAH** dari body/query request.
- Jangan pernah mengembalikan kolom `password_hash` di response.
- Error: lempar `HttpError` (mis. `new HttpError(404, 'Tiket tidak ditemukan')`). Express 5 otomatis
  meneruskan error dari handler async ke error handler, jadi tidak perlu `try/catch` di setiap controller.
- Format error seragam: `{ statusCode, message, details? }`.
- Express 5: `req.query` bersifat read-only. Hasil validasi query disimpan di `res.locals.query`,
  hasil validasi body boleh menimpa `req.body`.
- Pagination: response `{ items, total, page, limit }`.
- Konfigurasi dibaca dari `.env` (dotenv) dan divalidasi. Sediakan `.env.example`.

## Aturan Frontend

- Struktur: `src/app/core` (models, services, interceptors, guards), `src/app/layout`,
  `src/app/features/<fitur>`, `src/app/shared` (komponen kecil yang dipakai ulang).
- Semua komponen standalone. Gunakan control flow baru (`@if`, `@for`), signals untuk state,
  `inject()` untuk dependency injection, dan reactive forms.
- Route memakai `loadComponent` (lazy loading).
- HTTP: satu service per resource (auth, users, categories, tickets). Base URL dari environment.
- Styling hanya dengan class Tailwind. Tampilan bersih dan sederhana, responsif.
- Teks UI dalam bahasa Indonesia.
