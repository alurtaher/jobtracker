// controllers/jobApplicationController.js

const JobApplication = require('../models/Application');
const uploadToS3 = require('../utils/uploadToS3'); // adjust path as needed

module.exports = {
  // Create a new job application
  createJobApplication: async (req, res) => {
    try {
      const {
        companyName,
        jobTitle,
        applicationDate,
        status,
        notes,
        resumeBase64,
        resumeName,
        resumeMimeType,
        coverLetterBase64,
        coverLetterName,
        coverLetterMimeType
      } = req.body;

      const userId = req.user.id;

      let resumePath = null;
      let coverLetterPath = null;

      // Upload resume to S3 if base64 data provided
      if (resumeBase64 && resumeName && resumeMimeType) {
        const resumeBuffer = Buffer.from(resumeBase64, 'base64');
        resumePath = await uploadToS3(resumeBuffer, resumeName, resumeMimeType);
      }

      // Upload cover letter to S3 if base64 data provided
      if (coverLetterBase64 && coverLetterName && coverLetterMimeType) {
        const coverLetterBuffer = Buffer.from(coverLetterBase64, 'base64');
        coverLetterPath = await uploadToS3(coverLetterBuffer, coverLetterName, coverLetterMimeType);
      }

      const jobApp = await JobApplication.create({
        companyName,
        jobTitle,
        applicationDate,
        status: status || 'applied',
        notes,
        resumePath,
        coverLetterPath,
        user_id:userId
      });

      res.status(201).json(jobApp);
    } catch (error) {
      console.error('Create job application error:', error);
      res.status(500).json({ error: 'Server error while creating job application' });
    }
},

  // Get all job applications for logged-in user
  getJobApplications: async (req, res) => {
    try {
      const userId = req.user.id;

      const jobApps = await JobApplication.findAll({
        where: { user_id:userId },
        order: [['applicationDate', 'DESC']]
      });

      res.status(200).json(jobApps);
    } catch (error) {
      console.error('Get job applications error:', error);
      res.status(500).json({ error: 'Server error while fetching job applications' });
    }
  },

  // Get a single job application by ID
  getJobApplicationById: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const jobApp = await JobApplication.findOne({
        where: { id, user_id:userId }
      });

      if (!jobApp) {
        return res.status(404).json({ error: 'Job application not found' });
      }

      res.status(200).json(jobApp);
    } catch (error) {
      console.error('Get job application error:', error);
      res.status(500).json({ error: 'Server error while fetching job application' });
    }
  },

  // Update a job application by ID
  updateJobApplication: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const updateData = req.body;

      const jobApp = await JobApplication.findOne({ where: { id, user_id:userId } });
      if (!jobApp) {
        return res.status(404).json({ error: 'Job application not found' });
      }

      await jobApp.update(updateData);

      res.status(200).json(jobApp);
    } catch (error) {
      console.error('Update job application error:', error);
      res.status(500).json({ error: 'Server error while updating job application' });
    }
  },

  // Delete a job application by ID
  deleteJobApplication: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const jobApp = await JobApplication.findOne({ where: { id, user_id:userId } });
      if (!jobApp) {
        return res.status(404).json({ error: 'Job application not found' });
      }

      await jobApp.destroy();

      res.status(200).json({ message: 'Job application deleted successfully' });
    } catch (error) {
      console.error('Delete job application error:', error);
      res.status(500).json({ error: 'Server error while deleting job application' });
    }
  }
};