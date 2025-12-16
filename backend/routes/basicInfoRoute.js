import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { getCvBasicInfoById, upsertCvBasicInfo } from '../controllers/basicInfoController.js';
import { basicInfoValidator } from '../validator/basicInfoValidator.js'; // Import Validator

const router = express.Router();

// GET detail
router.get('/:cvId', authenticateToken, getCvBasicInfoById);

// UPSERT (Create or Update) - Pakai validator di tengah
router.put('/:cvId', authenticateToken, basicInfoValidator, upsertCvBasicInfo);

export default router;