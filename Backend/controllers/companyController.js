const Company = require('../models/Company');

module.exports = {
  createCompany: async (req, res) => {
    try {
      const userId = req.user.id;
      const { name, industry, size, contactInfo, notes } = req.body;

      const company = await Company.create({ user_id: userId, name, industry, size, contactInfo, notes });
      res.status(201).json(company);
    } catch (error) {
      console.error('Create company error:', error);
      res.status(500).json({ error: 'Server error while creating company' });
    }
  },

  getCompanies: async (req, res) => {
    try {
      const userId = req.user.id;
      const companies = await Company.findAll({ where: { user_id: userId } });
      res.json(companies);
    } catch (error) {
      console.error('Get companies error:', error);
      res.status(500).json({ error: 'Server error while fetching companies' });
    }
  },

  getCompanyById: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const company = await Company.findOne({ where: { id, user_id: userId } });
      if (!company) return res.status(404).json({ error: 'Company not found' });

      res.json(company);
    } catch (error) {
      console.error('Get company error:', error);
      res.status(500).json({ error: 'Server error while fetching company' });
    }
  },

  updateCompany: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const updateData = req.body;

      const company = await Company.findOne({ where: { id, user_id: userId } });
      if (!company) return res.status(404).json({ error: 'Company not found' });

      await company.update(updateData);
      res.json(company);
    } catch (error) {
      console.error('Update company error:', error);
      res.status(500).json({ error: 'Server error while updating company' });
    }
  },

  deleteCompany: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const company = await Company.findOne({ where: { id, user_id: userId } });
      if (!company) return res.status(404).json({ error: 'Company not found' });

      await company.destroy();
      res.json({ message: 'Company deleted' });
    } catch (error) {
      console.error('Delete company error:', error);
      res.status(500).json({ error: 'Server error while deleting company' });
    }
  },
};