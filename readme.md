# 🚀 AI CV Maker - Developer Guide

Panduan ini dibuat khusus untuk anggota kelompok agar bisa menjalankan project di komputer masing-masing.

---

## 📋 Prasyarat (Wajib Install)

Pastikan laptop kalian sudah terinstall:

- **Node.js** (minimal v16, rekomendasi v20+)  
- **Git**  
- **npm** atau **yarn** (biasanya sudah terinstall dengan Node.js)

### Verifikasi instalasi:

Buka terminal dan jalankan perintah berikut:

```bash
node --version
npm --version
git --version
```

---

## ⚡ Quick Start – Cara Menjalankan Project

Ikuti langkah berikut **secara berurutan**.

---

### 1️⃣ Clone Repository

Buka terminal (CMD / PowerShell / Git Bash) di folder tujuan, lalu jalankan:

```bash
git clone https://github.com/USERNAME/NAMA-REPO-KITA.git
cd uascv-project
```

---

### 2️⃣ Setup Backend

Masuk ke folder backend dan install dependencies:

```bash
cd backend
npm install
```

**Buat file `.env`** di folder `backend/` dengan isi:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

# Server Configuration
PORT=3000
NODE_ENV=development
```

> ⚠️ **PENTING**: Minta file `.env` yang benar dari ketua kelompok atau cek di dokumentasi tim. Jangan commit file `.env` ke GitHub!

Jalankan backend:

```bash
# Mode development (dengan auto-reload)
npm run dev

# Mode production
npm start
```

Backend akan berjalan di `http://localhost:3000`

---

### 3️⃣ Setup Frontend

Di terminal yang **berbeda**, masuk ke folder frontend:

```bash
cd frontend
npm install
```

Jalankan development server:

```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173` (atau port lain jika 5173 sudah terpakai)

---

## 📁 Project Structure

```
uascv-project/
├── backend/                    # REST API (Express.js)
│   ├── app.js                 # Entry point
│   ├── package.json
│   ├── config/                # Konfigurasi (Supabase, dll)
│   ├── controllers/           # Logic aplikasi
│   ├── middleware/            # Middleware Express
│   └── routes/                # API routes
│
├── frontend/                  # Frontend (Vue 3 + Vite)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── App.vue           # Root component
│   │   ├── main.js           # Entry point
│   │   ├── components/       # Reusable components
│   │   ├── router/           # Vue Router config
│   │   ├── stores/           # Pinia stores (state management)
│   │   ├── views/            # Page components
│   │   └── api/              # API calls (Axios)
│   └── public/               # Static files
│
└── README.md                 # File ini
```

---

## 🛠️ Teknologi yang Digunakan

### Backend
- **Express.js** - Web framework
- **Supabase** - Database & Authentication
- **bcrypt** - Password hashing
- **JWT** - Token authentication
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variables

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **Vite** - Build tool & dev server
- **Vue Router** - Routing
- **Pinia** - State management
- **Axios** - HTTP client
- **html2pdf.js** - PDF export

---

## 📝 Available Scripts

### Backend

```bash
npm run dev    # Jalankan dengan nodemon (auto-reload saat ada perubahan)
npm start      # Jalankan production
```

### Frontend

```bash
npm run dev      # Jalankan development server
npm run build    # Build untuk production
npm run preview  # Preview hasil build
npm run lint     # Check & fix code style
```

---

## 🐛 Troubleshooting

### Port sudah terpakai

Jika port 3000 atau 5173 sudah digunakan aplikasi lain:

**Backend:**
```bash
# Di file backend/app.js, ubah PORT atau jalankan di port berbeda
PORT=4000 npm run dev
```

**Frontend:**
```bash
# Vite otomatis akan cari port lain jika 5173 terpakai
npm run dev
```

### Dependencies error

Jika ada error saat install dependencies:

```bash
# Bersihkan cache npm
npm cache clean --force

# Hapus folder node_modules dan lock file
rm -r node_modules package-lock.json

# Install ulang
npm install
```

### Module not found error

Pastikan:
1. Sudah menjalankan `npm install` di folder backend dan frontend
2. Tidak ada typo di import statement
3. File `.env` sudah dibuat dengan konfigurasi yang benar

---

## 🚀 Deployment

Akan diupdate ketika sudah siap untuk production.

---

## 📧 Kontak & Support

Jika ada pertanyaan atau masalah:
- Tanya ke ketua kelompok
- Create issue di repository ini
- Hubungi tim developer

---

## 📄 License

ISC
