import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { getCvBasicInfoById, insertCvBasicInfo, updateCvBasicInfo} from '../controllers/basicInfoController.js';

const router = express.Router();

router.get('/cv/:cvId/basic', authenticateToken, getCvBasicInfoById);
router.post('/cv/:cvId/basic', authenticateToken, insertCvBasicInfo);
router.put('/cv/:cvId/basic/:basicId', authenticateToken, updateCvBasicInfo);

export default router;