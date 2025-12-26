# 🚀 AI CV Maker (UASCV)

Aplikasi pembuat CV otomatis berbasis AI yang membantu mahasiswa dan profesional membuat CV standar industri dalam hitungan menit.

![Landing Page](Screenshots/root.png)

---

## 📋 Daftar Isi
1. [Fitur Utama](#-fitur-utama)
2. [Prasyarat](#-prasyarat)
3. [Cara Menjalankan (Quick Start)](#-cara-menjalankan-quick-start)
4. [Daftar Endpoint API](#-daftar-endpoint-api)
5. [Database ERD](#-database-erd)
6. [Galeri Screenshot](#-galeri-screenshot)

---

## ✨ Fitur Utama
- **AI-Powered**: Generate deskripsi pekerjaan, ringkasan profesional, dan style CV menggunakan Gemini AI.
- **Real-time Preview**: Lihat perubahan CV secara langsung saat diedit.
- **Multiple Templates**: Pilihan template Modern, Creative, Minimalist, dan Professional.
- **Job Tracker**: Pantau status lamaran kerja (Wishlist, Applied, Interview, Offer).
- **PDF Export**: Download CV berkualitas tinggi siap cetak (A4).

---

## 📋 Prasyarat
Pastikan sudah terinstall:
- **Node.js** (v16+)
- **NPM**
- **Git**
- **PostgreSQL** (via Supabase)

---

## ⚡ Cara Menjalankan (Quick Start)

### 1. Setup Backend
Backend berjalan di Port `3000`.

```bash
# Masuk ke folder backend
cd backend

# Install dependencies
npm install

# Buat file .env (minta ke ketua tim/lihat contoh)
# Pastikan konfigurasi SUPABASE dan GEMINI_TOKEN sudah benar

# Jalankan server
npm run dev
```

### 2. Setup Frontend
Frontend berjalan di Port `5173`.

```bash
# Buka terminal baru, masuk ke folder frontend
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Aces aplikasi di: `http://localhost:5173`

---

## 🔌 Daftar Endpoint API
Base URL: `http://localhost:3000/api`

### 1. Authentication
*   `POST /auth/register` - Daftar akun baru
*   `POST /auth/login` - Login user

### 2. CV Management
*   `GET /cvs` - Ambil semua CV user
*   `POST /cvs` - Buat CV baru
*   `GET /cvs/:id/full` - Ambil data lengkap CV
*   `PUT /cvs/:id` - Update data CV
*   `POST /cvs/:id/toggle` - Link/Unlink item ke CV

### 3. Master Data (Profile Items)
*   `GET/POST/PUT/DELETE /master/educations` - CRUD Pendidikan
*   `GET/POST/PUT/DELETE /master/experiences` - CRUD Pengalaman
*   `GET/POST/PUT/DELETE /master/skills` - CRUD Skill

### 4. Job Tracker
*   `GET /job-tracker` - List semua lamaran
*   `POST /job-tracker` - Tambah lamaran baru
*   `PATCH /job-tracker/:id/status` - Update status lamaran
*   `GET /job-tracker/stats` - Statistik lamaran

### 5. AI Features
*   `POST /ai/experience` - Generate deskripsi pengalaman kerja
*   `POST /ai/summary` - Generate summary profile

---

## 🗄️ Database ERD
Struktur database relasional yang digunakan dalam aplikasi ini.

![ERD Database](Screenshots/ERD%20UASCV.jpg)

---

## 📸 Galeri Screenshot

### 1. Halaman Utama (Landing Page)
Halaman depan yang menyambut pengguna.
![Landing Page](Screenshots/root.png)

### 2. Onboarding & Login
Proses masuk ke dalam sistem.
![Onboarding](Screenshots/onBoarding.png)

### 3. Dashboard
Pusat pengelolaan CV dan Job Tracker.
![Dashboard](Screenshots/basicDetails.png)

### 4. Edit Pendidikan
Formulir untuk menambah riwayat pendidikan.
![Pendidikan](Screenshots/pendidikan.png)

### 5. Edit Pengalaman Kerja
Formulir pengalaman kerja dengan bantuan AI.
![Pengalaman](Screenshots/pengalaman.png)

### 6. Edit Keahlian (Skills)
Manajemen skill dengan level kemahiran.
![Keahlian](Screenshots/keah.png)

### 7. Preview CV
Tampilan akhir CV yang siap di-download.
![Preview](Screenshots/preview.png)

### 8. Job Tracker
Fitur Kanban board untuk memantau status lamaran kerja.
![Job Tracker](Screenshots/jobTracker.png)

---
