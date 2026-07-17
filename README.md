# Tugas 9 API Todo dengan MySQL + TypeORM

Membuat API Todo dengan NestJS + MySQL (XAMPP) + TypeORM

## 1. Struktur Project

```
todo-api/
├── src/
│   ├── main.ts                   
│   ├── app.module.ts                
│   └── todo/
│       ├── entities/todo.entity.ts  
│       ├── dto/
│       │   ├── create-todo.dto.ts   
│       │   └── update-todo.dto.ts   
│       ├── todo.service.ts          
│       ├── todo.controller.ts       
│       └── todo.module.ts
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── nest-cli.json
├── .env.example
└── Todo-API.postman_collection.json # koleksi testing Postman
```

## 2. Menjalankan Program
### a. Persiapan Database (XAMPP)
1. Jalankan XAMPP Control Panelnya, start action Apache dan MySQL.
2. Buka `http://localhost/phpmyadmin` dengan cara klik admin di mysqlnya.
3. Buat database baru bernama dengan nama database_todo sesuai dengan .env yang ada di project.

### b. Instalasi & Menjalankan

```bash
npm install
npm run start:dev
```

Jika program berhasil dijalankan akan muncul perintah di log yaitu:
```
Perintah ToDo akan berjalan di: http://localhost:3000/api/v1
```

## 3. Perintah Endpoint di postman
### Contoh Body untuk menu post di postman

```json
{
  "title": "Sepatu Sneakers Nike P-6000",
  "description": "Ukuran 42, warna Silver Metalic, dengan bahan kanvas premium untuk gaya kasual.",
  "priority": "high",
  "dueDate": "2026-07-15"
}
```

## 4. Penjelasan Setiap Error Handlingnya
Contoh :

| Skenario                                   | Status Code            |
|---------------------------------------------|--------------------------|
| Body tidak valid (title kosong, dll)        | `400 Bad Request`        |
| Properti asing di body                      | `400 Bad Request`        |
| `:id` bukan angka                            | `400 Bad Request`        |
| `?completed=` bukan `true`/`false`           | `400 Bad Request`        |
| Todo dengan id tertentu tidak ditemukan      | `404 Not Found`          |
| Create/Update berhasil                       | `201` / `200`            |
| Delete berhasil                              | `204 No Content`         |
