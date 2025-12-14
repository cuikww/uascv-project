// backend/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import supabase from './config/supabase.js'; // <--- IMPORT INI PENTING
import authRoute from './routes/authRoute.js';
import cvRoute from './routes/cvRoute.js';
import basicInfoRoute from './routes/basicInfoRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', authRoute);
app.use('/onboarding', basicInfoRoute);
app.use('/onboarding', cvRoute);

// --- ROUTE DEFAULT ---
app.get('/', (req, res) => {
    res.json({ message: 'Backend is Running!' });
});

// --- ROUTE TEST KONEKSI SUPABASE ---
app.get('/test-connection', async (req, res) => {
    try {
        // Kita coba ambil data dari tabel 'users' (meskipun tabelnya mungkin belum ada)
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .limit(1);

        if (error) {
            // Jika errornya karena tabel belum ada, itu wajar.
            // Yang penting Supabase merespon.
            return res.status(500).json({ 
                status: 'Connected to Supabase (But Error Occurred)', 
                details: error.message,
                hint: 'Connection is working! If error is "relation does not exist", create the table first.'
            });
        }

        res.json({ 
            status: 'Success! Connected to Supabase', 
            data: data 
        });

    } catch (err) {
        res.status(500).json({ 
            status: 'Connection Failed', 
            error: err.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});