# Tugas 9 — API Todo (NestJS + MySQL/XAMPP + TypeORM)

API CRUD Todo dengan validasi input, filter status, dan error handling
yang sesuai standar (`400` untuk request tidak valid, `404` untuk data
tidak ditemukan).

## 1. Struktur Project

```
todo-api/
├── src/
│   ├── main.ts                     # entry point, prefix /api/v1, ValidationPipe global
│   ├── app.module.ts                # konfigurasi koneksi TypeORM ke MySQL
│   └── todo/
│       ├── entities/todo.entity.ts  # Entity Todo
│       ├── dto/
│       │   ├── create-todo.dto.ts   # DTO + validasi class-validator
│       │   └── update-todo.dto.ts   # DTO update (semua field opsional)
│       ├── todo.service.ts          # logika CRUD via Repository
│       ├── todo.controller.ts       # routing endpoint
│       └── todo.module.ts
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── nest-cli.json
├── .env.example
└── Todo-API.postman_collection.json # koleksi testing Postman
```

## 2. Persiapan Database (XAMPP)

1. Jalankan **XAMPP Control Panel**, start service **Apache** dan **MySQL**.
2. Buka `http://localhost/phpmyadmin`.
3. Buat database baru bernama **`todo_db`** (atau nama lain, sesuaikan `.env`).
   - Tidak perlu membuat tabel manual — TypeORM akan membuatnya otomatis
     lewat opsi `synchronize: true` (sudah diatur di `app.module.ts`,
     hanya untuk mode development).

## 3. Konfigurasi Environment

Salin `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Sesuaikan kredensial bila perlu (default XAMPP biasanya `root` tanpa password):

```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=todo_db
PORT=3000
```

## 4. Instalasi & Menjalankan

```bash
npm install
npm run start:dev
```

Jika berhasil, akan muncul log:

```
🚀 Aplikasi berjalan di: http://localhost:3000/api/v1
```

TypeORM otomatis membuat tabel `todos` di database `todo_db` sesuai
definisi entity.

## 5. Spesifikasi Endpoint

| Endpoint                          | Method | Deskripsi                              |
|------------------------------------|--------|-----------------------------------------|
| `/api/v1/todos`                    | POST   | Tambah todo baru (dengan validasi)      |
| `/api/v1/todos`                    | GET    | Ambil semua todo                        |
| `/api/v1/todos?completed=true`     | GET    | Filter todo yang sudah selesai          |
| `/api/v1/todos?completed=false`    | GET    | Filter todo yang belum selesai          |
| `/api/v1/todos/:id`                | GET    | Ambil todo berdasarkan ID                |
| `/api/v1/todos/:id`                | PUT    | Update todo                              |
| `/api/v1/todos/:id`                | DELETE | Hapus todo                               |

### Contoh Body — Create / Update

```json
{
  "title": "Belajar NestJS",
  "description": "Mengerjakan tugas 9 API Todo",
  "priority": "high",
  "dueDate": "2026-07-05"
}
```

### Aturan Validasi (DTO)

| Field       | Aturan                                         |
|-------------|--------------------------------------------------|
| title       | wajib diisi, string, maksimal 100 karakter       |
| description | opsional, string                                 |
| priority    | opsional, hanya boleh: `low`, `medium`, `high`   |
| dueDate     | opsional, format tanggal ISO (`YYYY-MM-DD`)      |

`ValidationPipe` global diaktifkan dengan:
- `whitelist: true` → properti yang tidak ada di DTO otomatis dibuang
- `forbidNonWhitelisted: true` → jika ada properti asing, request ditolak (400)
- `transform: true` → payload otomatis dikonversi menjadi instance class DTO

## 6. Error Handling

| Skenario                                   | Status Code            |
|---------------------------------------------|--------------------------|
| Body tidak valid (title kosong, dll)        | `400 Bad Request`        |
| Properti asing di body                      | `400 Bad Request`        |
| `:id` bukan angka                            | `400 Bad Request`        |
| `?completed=` bukan `true`/`false`           | `400 Bad Request`        |
| Todo dengan id tertentu tidak ditemukan      | `404 Not Found`          |
| Create/Update berhasil                       | `201` / `200`            |
| Delete berhasil                              | `204 No Content`         |

## 7. Testing dengan Postman

Import file **`Todo-API.postman_collection.json`** ke Postman
(`File > Import`). Koleksi ini sudah mencakup 16 request dengan skenario:

- ✅ Create todo (valid)
- ❌ Create todo — title kosong
- ❌ Create todo — priority tidak valid
- ❌ Create todo — field tidak dikenal (forbidNonWhitelisted)
- ✅ Get all todos
- ✅ Get all todos — filter `completed=true` / `completed=false`
- ❌ Get all todos — filter value tidak valid
- ✅ Get todo by ID (valid)
- ❌ Get todo by ID — tidak ditemukan (404)
- ❌ Get todo by ID — id bukan angka (400)
- ✅ Update todo (valid)
- ❌ Update todo — tidak ditemukan (404)
- ❌ Update todo — priority tidak valid (400)
- ✅ Delete todo (valid, 204)
- ❌ Delete todo — tidak ditemukan (404)

Setiap request sudah dilengkapi script `pm.test()` sederhana untuk
memverifikasi status code secara otomatis.

Variabel collection:
- `baseUrl` → default `http://localhost:3000/api/v1`
- `todoId` → ubah sesuai id todo yang ingin diuji (default `1`)

**Urutan pengujian yang disarankan:** jalankan request "Create" dulu untuk
mendapatkan id baru, catat id-nya, lalu update variabel `todoId` sebelum
menjalankan request Get/Update/Delete by ID.

## 8. Catatan Tambahan

- `synchronize: true` hanya dipakai untuk kebutuhan development/tugas.
  Di lingkungan production sebaiknya gunakan **migration** TypeORM.
- Kolom `priority` menggunakan tipe `enum` MySQL (`low`, `medium`, `high`)
  sesuai spesifikasi entity.
- Default urutan hasil `GET /todos` adalah dari yang terbaru (`createdAt DESC`).