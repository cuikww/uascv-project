import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { 
    getAllCvs, 
    createCv, 
    getCvFullContent, 
    toggleItemInCv,
    updateCv,
    deleteCv // <--- 1. Import ini
} from '../controllers/cvController.js';

const router = express.Router();

router.get('/', authenticateToken, getAllCvs);
router.post('/', authenticateToken, createCv);
router.get('/:cvId/full', authenticateToken, getCvFullContent);
router.post('/:cvId/toggle', authenticateToken, toggleItemInCv);
router.put('/:cvId', authenticateToken, updateCv);
router.delete('/:cvId', authenticateToken, deleteCv);

export default router;