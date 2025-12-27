import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { generateExperienceDesc, generateSummary, generateStyle } from '../controllers/aiController.js';

const router = express.Router();

router.post('/experience', authenticateToken, generateExperienceDesc);

router.post('/summary', authenticateToken, generateSummary);

router.post('/style', authenticateToken, generateStyle);

export default router;