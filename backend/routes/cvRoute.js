import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { getCvById, getMyCvs, createCv, updateCv, deleteCv } from '../controllers/cvController.js';
import { createCvValidator } from '../validator/cvValidator.js';

const router = express.Router();

router.get('/cv/:cvId', authenticateToken, getCvById)
router.get('/cv', authenticateToken, getMyCvs)
router.post('/cv', authenticateToken, createCvValidator, createCv);
router.put('/cv/:cvId', authenticateToken, updateCv);
router.delete('/cv/:cvId', authenticateToken, deleteCv)

export default router;