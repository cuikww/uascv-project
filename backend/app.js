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
app.use('/api/auth', authRoute);
app.use('/api/cvs', cvRoute); 
app.use('/api/cv-details', basicInfoRoute);

app.get('/', (req, res) => {
    res.json({ message: 'Backend is Running!' });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});