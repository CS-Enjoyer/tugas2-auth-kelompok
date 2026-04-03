# 🗂️ Web Monorepo

![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)
![Django](https://img.shields.io/badge/Django-Python_3.10+-092E20?style=flat-square&logo=django&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=black)
![Node](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)

> Setup guide untuk pengembangan lokal — frontend **React** + backend **Django** + database **Supabase (PostgreSQL)**

---

## 🧰 Tech Stack

| Layer | Teknologi | Port |
|---|---|---|
| Frontend | React 18+ (Vite) | `:5173` |
| Backend | Django (Python 3.10+) | `:8000` |
| Database | PostgreSQL via Supabase | `:6543` |

---

## ✅ Prasyarat

Pastikan tools berikut sudah terinstal sebelum memulai:

- **Node.js** v18+
- **Python** v3.10+
- **pip**
- **npm**
- Akses ke **Supabase project**

---

## 01 — Setup Backend (Django)

### Masuk ke folder backend

```bash
cd backend
```

### Buat & aktifkan Virtual Environment

**Windows:**
```bash
python -m venv venv
.\venv\Scripts\activate
```

**macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Instalasi dependencies

```bash
pip install -r requirements.txt
```

### Konfigurasi file `.env`

Buat file `.env` di dalam folder `backend/` dan isi dengan nilai berikut:

```env
DB_NAME=postgres
DB_USER=postgres.mqsreerzzrkhtqzkmlsp
DB_PASSWORD=B7CkuuTrwndDbXYE
DB_HOST=aws-1-ap-southeast-1.pooler.supabase.com
DB_PORT=6543
```

### Migrasi database

```bash
python manage.py makemigrations
python manage.py migrate
```

### Jalankan server Django

```bash
python manage.py runserver
```

> ✅ API tersedia di **http://localhost:8000**

---

## 02 — Setup Frontend (React)

> 💡 Buka **terminal baru** — biarkan server Django tetap berjalan.

### Masuk ke folder frontend

```bash
cd frontend
```

### Instalasi node modules

```bash
npm install
```

### Jalankan dev server

```bash
npm run dev
```

> ✅ Frontend berjalan di **http://localhost:5173**

---

## 🚀 Quick Start (Ringkasan)

```bash
# Terminal 1 — Backend
cd backend
python3 -m venv venv && source venv/bin/activate   # atau .\venv\Scripts\activate di Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

---

> Pastikan kedua server berjalan **bersamaan** di terminal terpisah.