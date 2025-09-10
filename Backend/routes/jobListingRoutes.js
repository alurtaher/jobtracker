const express = require('express');
const router = express.Router();
const jobListingController = require('../controllers/jobListingController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', jobListingController.getJobListings);
router.post('/', jobListingController.createJobListing);
router.get('/:id', jobListingController.getJobListingById);
router.put('/:id', jobListingController.updateJobListing);
router.delete('/:id', jobListingController.deleteJobListing);

module.exports = router;