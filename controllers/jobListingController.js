const JobListing = require('../models/JobListing');
const Company = require('../models/Company');

module.exports = {
  createJobListing: async (req, res) => {
    try {
      const { title, description, applyUrl, status, companyId } = req.body;

      // Verify company belongs to user
      const company = await Company.findOne({ where: { id: companyId, user_id: req.user.id } });
      if (!company) return res.status(400).json({ error: 'Invalid or unauthorized company ID' });

      const jobListing = await JobListing.create({
        title,
        description,
        applyUrl,
        status,
        company_id: companyId,
      });

      res.status(201).json(jobListing);
    } catch (error) {
      console.error('Create job listing error:', error);
      res.status(500).json({ error: 'Server error while creating job listing' });
    }
  },

  getJobListings: async (req, res) => {
    try {
      const userId = req.user.id;

      const listings = await JobListing.findAll({
        include: [{
          model: Company,
          where: { user_id: userId },
          attributes: ['id', 'name', 'industry']
        }],
        order: [['created_at', 'DESC']],
      });

      res.status(200).json(listings);
    } catch (error) {
      console.error('Get job listings error:', error);
      res.status(500).json({ error: 'Server error while fetching job listings' });
    }
  },

  getJobListingById: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const listing = await JobListing.findOne({
        where: { id },
        include: [{
          model: Company,
          where: { user_id: userId },
          attributes: ['id', 'name', 'industry']
        }]
      });

      if (!listing) return res.status(404).json({ error: 'Job listing not found' });

      res.status(200).json(listing);
    } catch (error) {
      console.error('Get job listing error:', error);
      res.status(500).json({ error: 'Server error while fetching job listing' });
    }
  },

  updateJobListing: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const updateData = req.body;

      const listing = await JobListing.findOne({
        where: { id },
        include: [{ model: Company, where: { user_id: userId } }]
      });

      if (!listing) return res.status(404).json({ error: 'Job listing not found' });

      await listing.update(updateData);
      res.status(200).json(listing);
    } catch (error) {
      console.error('Update job listing error:', error);
      res.status(500).json({ error: 'Server error while updating job listing' });
    }
  },

  deleteJobListing: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const listing = await JobListing.findOne({
        where: { id },
        include: [{ model: Company, where: { user_id: userId } }]
      });

      if (!listing) return res.status(404).json({ error: 'Job listing not found' });

      await listing.destroy();
      res.status(200).json({ message: 'Job listing deleted' });
    } catch (error) {
      console.error('Delete job listing error:', error);
      res.status(500).json({ error: 'Server error while deleting job listing' });
    }
  },
};