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

// Get all applications
router.get('/', authenticateToken, getAllJobApplications);

// Get applications grouped by status
router.get('/by-status', authenticateToken, getJobApplicationsByStatus);

// Get statistics
router.get('/stats', authenticateToken, getJobApplicationStats);

// Get single application
router.get('/:id', authenticateToken, getJobApplication);

// Create new application
router.post('/', authenticateToken, createJobApplication);

// Update application
router.put('/:id', authenticateToken, updateJobApplication);

// Update status only
router.patch('/:id/status', authenticateToken, updateJobApplicationStatus);

// Delete application
router.delete('/:id', authenticateToken, deleteJobApplication);

export default router;
