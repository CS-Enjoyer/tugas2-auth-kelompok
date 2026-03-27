# Web Monorepo Setup Guide

Selamat datang di proyek web monorepo (React & Django). Ikuti panduan di bawah ini untuk memulai pengembangan di environment lokal.

## Prasyarat
- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL

---

## 1. Setup Database PostgreSQL

1. Buka PostgreSQL lokal Anda (pgAdmin atau cli `psql`).
2. Buat database baru untuk proyek ini (misalnya `backend_core_db`).
   ```sql
   CREATE DATABASE backend_core_db;
   ```

---

## 2. Setup Backend (Django)

Masuk ke folder backend:
```bash
cd backend
```

### Mengaktifkan Virtual Environment
Buka terminal dan buat virtual environment (jika belum ada) lalu aktifkan:

**Windows:**
```bash
python -m venv venv
.\venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Instalasi Dependencies
Setelah virtual environment aktif, jalankan:
```bash
pip install -r requirements.txt
```

### Konfigurasi Environment Variables
Salin template `.env.example` menjadi `.env` dan gunakan isian database yang sudah Anda siapkan:
```bash
cp .env.example .env
```
Contoh isi `.env`:
```env
DB_NAME=backend_core_db
DB_USER=postgres
DB_PASSWORD=rahasia
DB_HOST=localhost
DB_PORT=5432
```

### Menjalankan Migrasi Django
Migrasi skema database ke PostgreSQL:
```bash
python manage.py makemigrations
python manage.py migrate
```

Jalankan server Django:
```bash
python manage.py runserver
```

---

## 3. Setup Frontend (React)

Buka terminal baru, dan masuk ke folder frontend:
```bash
cd frontend
```

### Instalasi Node Modules
Jalankan perintah berikut untuk menginstal semua dependency React:
```bash
npm install
```

### Menjalankan Development Server
```bash
npm run dev
```

Platform frontend sekarang dapat diakses melalui browser sesuai dengan alamat lokal yang muncul di terminal (biasanya `http://localhost:5173`).
