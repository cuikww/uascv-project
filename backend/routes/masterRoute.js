import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateSection } from '../validators/masterValidator.js';
import { getMasterData, addMasterData, updateMasterData, deleteMasterData } from '../controllers/masterController.js';

const router = express.Router();

router.get('/:section', authenticateToken, validateSection('get'), getMasterData);
router.post('/:section', authenticateToken, validateSection('add'), addMasterData);
router.put('/:section/:id', authenticateToken, validateSection('update'), updateMasterData);
router.delete('/:section/:id', authenticateToken, validateSection('delete'), deleteMasterData);

export default router;