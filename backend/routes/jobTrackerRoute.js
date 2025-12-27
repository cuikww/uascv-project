import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import {
    getAllJobApplications,
    getJobApplicationsByStatus,
    getJobApplication,
    createJobApplication,
    updateJobApplication,
    updateJobApplicationStatus,
    deleteJobApplication,
    getJobApplicationStats
} from '../controllers/jobTrackerController.js';

const router = express.Router();

router.get('/', authenticateToken, getAllJobApplications);

router.get('/by-status', authenticateToken, getJobApplicationsByStatus);

router.get('/stats', authenticateToken, getJobApplicationStats);

router.get('/:id', authenticateToken, getJobApplication);

router.post('/', authenticateToken, createJobApplication);

router.put('/:id', authenticateToken, updateJobApplication);

router.patch('/:id/status', authenticateToken, updateJobApplicationStatus);

router.delete('/:id', authenticateToken, deleteJobApplication);

export default router;
