const User = require('../models/User');
const path = require('path');

// const getProfilePage = (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'public', 'views', 'profile.html'));
// };

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

const updateprofile = async(req,res)=>{
   try {
    const userId = req.user.id; // from authMiddleware
    
    // Extract only allowed fields from the request body
    const { name, careerGoals } = req.body;

    // Validate required fields if needed (optional)
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Name is required and must be a string" });
    }

    // Find the user first
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update allowed fields only, exclude email to prevent changes
    user.name = name;
    user.careerGoals = careerGoals || user.careerGoals;

    await user.save();

    // Return updated user data (excluding email if preferred)
    return res.json(user);
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  getProfile,
  // getProfilePage,
  updateprofile
};
