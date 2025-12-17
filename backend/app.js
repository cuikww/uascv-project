// backend/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoute from './routes/authRoute.js';
import masterRoute from './routes/masterRoute.js';
import cvRoute from './routes/cvRoute.js';
import profileRoute from './routes/profileRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoute);
app.use('/api/profiles', profileRoute);
app.use('/api/master', masterRoute); 
app.use('/api/cvs', cvRoute);
app.get('/', (req, res) => {
    res.json({ message: 'Backend is Running!' });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});