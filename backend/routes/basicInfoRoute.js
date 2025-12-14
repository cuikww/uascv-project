import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { getCvBasicInfoById, insertCvBasicInfo, updateCvBasicInfo} from '../controllers/basicInfoController.js';

const router = express.Router();

router.get('/:cvId', authenticateToken, getCvBasicInfoById);
router.post('/:cvId', authenticateToken, insertCvBasicInfo);
router.put('/:cvId/:basicId', authenticateToken, updateCvBasicInfo);

export default router;