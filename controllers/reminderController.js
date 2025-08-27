const Reminder = require('../models/Reminder');
const JobApplication = require('../models/Application');

module.exports = {
  createReminder: async (req, res) => {
    try {
      const { jobApplicationId, reminderDate, message } = req.body;
      const userId = req.user.id;

      // Verify jobApplicationId belongs to user (optional but recommended)
      const jobApp = await JobApplication.findOne({ where: { id: jobApplicationId, user_id:userId } });
      if (!jobApp) {
        return res.status(400).json({ error: 'Invalid job application ID' });
      }

      const reminder = await Reminder.create({
        jobApplicationId,
        reminderDate,
        message,
        notified: false,
        user_id:userId,
        job_application_id:jobApplicationId,
      });

      res.status(201).json(reminder);
    } catch (error) {
      console.error('Create reminder error:', error);
      res.status(500).json({ error: 'Server error while creating reminder' });
    }
  },

  getReminders: async (req, res) => {
    try {
      const userId = req.user.id;

      const reminders = await Reminder.findAll({
        where: { user_id:userId },
        include: [{
          model: JobApplication,
          attributes: ['companyName', 'jobTitle', 'status'],
          required: true
        }],
        order: [['reminderDate', 'ASC']]
      });

      res.json(reminders);
    } catch (error) {
      console.error('Get reminders error:', error);
      res.status(500).json({ error: 'Server error while fetching reminders' });
    }
  },

  updateReminder: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const updateData = req.body;

      const reminder = await Reminder.findOne({ where: { id, user_id:userId } });
      if (!reminder) {
        return res.status(404).json({ error: 'Reminder not found' });
      }

      await reminder.update(updateData);
      res.json(reminder);
    } catch (error) {
      console.error('Update reminder error:', error);
      res.status(500).json({ error: 'Server error while updating reminder' });
    }
  },

  deleteReminder: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const reminder = await Reminder.findOne({ where: { id, user_id:userId } });
      if (!reminder) {
        return res.status(404).json({ error: 'Reminder not found' });
      }

      await reminder.destroy();
      res.json({ message: 'Reminder deleted' });
    } catch (error) {
      console.error('Delete reminder error:', error);
      res.status(500).json({ error: 'Server error while deleting reminder' });
    }
  }
};