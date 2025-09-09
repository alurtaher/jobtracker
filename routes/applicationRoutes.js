const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const jobApplicationController = require('../controllers/applicationController');
const upload = require('../utils/uploadToS3')

router.use(authMiddleware)

// Create a new job application
router.post('/', upload, jobApplicationController.createJobApplication);

// Get all job applications for logged-in user
router.get('/',  jobApplicationController.getJobApplications);

// Get a specific job application by ID
router.get('/:id',  jobApplicationController.getJobApplicationById);

// Update a job application by ID
router.put('/:id',upload, jobApplicationController.updateJobApplication);

// Delete a job application by ID
router.delete('/:id',  jobApplicationController.deleteJobApplication);

module.exports = router;