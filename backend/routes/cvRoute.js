import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { getCvById, getMyCvs, createCv, updateCv, deleteCv } from '../controllers/cvController.js';
import { createCvValidator } from '../validator/cvValidator.js';

const router = express.Router();

// Hapus prefix '/cv' di sini karena di app.js nanti sudah didefinisikan parent-nya
// RESTful Standard:
router.get('/', authenticateToken, getMyCvs);           // GET /api/cvs
router.post('/', authenticateToken, createCvValidator, createCv); // POST /api/cvs
router.get('/:cvId', authenticateToken, getCvById);     // GET /api/cvs/:id
router.put('/:cvId', authenticateToken, updateCv);      // PUT /api/cvs/:id
router.delete('/:cvId', authenticateToken, deleteCv);   // DELETE /api/cvs/:id

export default router;