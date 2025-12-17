import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { getProfile, saveProfile } from '../controllers/profileController.js';
import { saveProfileValidator } from '../validators/profileValidator.js';

const router = express.Router();

router.get('/', authenticateToken, getProfile);
router.put('/', authenticateToken, saveProfileValidator, saveProfile);

export default router;