const User = require('../models/User');
const path = require('path');

const getProfilePage = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'views', 'profile.html'));
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;  // from authMiddleware

    const user = await User.findByPk(userId, {
      attributes: ['id', 'email', 'name', 'careerGoals', 'createdAt', 'updatedAt']
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getProfile,
  getProfilePage
};
