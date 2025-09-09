const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// router.get('/profile', userController.getProfilePage);
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/updateprofile',authMiddleware,userController.updateprofile)

module.exports = router;