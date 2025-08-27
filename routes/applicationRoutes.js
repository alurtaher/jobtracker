const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const jobApplicationController = require('../controllers/applicationController');

// Create a new job application
router.post('/', authMiddleware, jobApplicationController.createJobApplication);

// Get all job applications for logged-in user
router.get('/', authMiddleware, jobApplicationController.getJobApplications);

// Get a specific job application by ID
router.get('/:id', authMiddleware, jobApplicationController.getJobApplicationById);

// Update a job application by ID
router.put('/:id', authMiddleware, jobApplicationController.updateJobApplication);

// Delete a job application by ID
router.delete('/:id', authMiddleware, jobApplicationController.deleteJobApplication);

module.exports = router;