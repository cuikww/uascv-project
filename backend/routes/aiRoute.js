import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { generateExperienceDesc, generateSummary, generateStyle } from '../controllers/aiController.js';

const router = express.Router();

// Rate Limiting (Opsional tapi disarankan agar token AI tidak bocor/habis)
// Untuk sekarang kita proteksi pakai authenticateToken saja

// POST /api/ai/experience
router.post('/experience', authenticateToken, generateExperienceDesc);

// POST /api/ai/summary
router.post('/summary', authenticateToken, generateSummary);

// POST /api/ai/style
router.post('/style', authenticateToken, generateStyle);

export default router;