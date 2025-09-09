const Reminder = require('../models/Reminder');
const JobApplication = require('../models/Application');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

module.exports = {
  // Create a new reminder (store as IST directly)
  createReminder: async (req, res) => {
    try {
      const { jobApplicationId, reminderDate, message } = req.body;
      const userId = req.user.id;

      // Verify jobApplicationId belongs to user
      const jobApp = await JobApplication.findOne({
        where: { id: jobApplicationId, user_id: userId }
      });
      if (!jobApp) {
        return res.status(400).json({ error: 'Invalid job application ID' });
      }

      console.log('previous Date',reminderDate)

      // Convert to IST format (YYYY-MM-DD HH:mm:ss) before saving
      const reminderDateIST = dayjs(reminderDate)
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss");

        console.log('Changed Date',reminderDateIST)

      const reminder = await Reminder.create({
        jobApplicationId,
        reminderDate: reminderDateIST,
        message,
        notified: false,
        user_id: userId,
        job_application_id: jobApplicationId,
      });

      res.status(201).json(reminder);
    } catch (error) {
      console.error('Create reminder error:', error);
      res.status(500).json({ error: 'Server error while creating reminder' });
    }
  },

  // Get reminders (format reminderDate in IST before sending)
  getReminders: async (req, res) => {
    try {
      const userId = req.user.id;

      const reminders = await Reminder.findAll({
        where: { user_id: userId },
        include: [{
          model: JobApplication,
          attributes: ['companyName', 'jobTitle', 'status'],
          required: true
        }],
        order: [['reminderDate', 'ASC']]
      });

      // Format dates in IST
      const remindersWithIST = reminders.map(r => {
        const reminder = r.toJSON();
        reminder.reminderDate = dayjs(reminder.reminderDate)
          .tz("Asia/Kolkata")
          .format("YYYY-MM-DD HH:mm:ss");
        return reminder;
      });

      res.json(remindersWithIST);
    } catch (error) {
      console.error('Get reminders error:', error);
      res.status(500).json({ error: 'Server error while fetching reminders' });
    }
  },

  // Update reminder (convert reminderDate to IST if provided)
  updateReminder: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      let updateData = { ...req.body };

      const reminder = await Reminder.findOne({ where: { id, user_id: userId } });
      if (!reminder) {
        return res.status(404).json({ error: 'Reminder not found' });
      }

      // If reminderDate is updated, convert to IST
      if (updateData.reminderDate) {
        updateData.reminderDate = dayjs(updateData.reminderDate)
          .tz("Asia/Kolkata")
          .format("YYYY-MM-DD HH:mm:ss");
      }

      await reminder.update(updateData);

      // Ensure reminderDate is returned in IST
      const updatedReminder = reminder.toJSON();
      updatedReminder.reminderDate = dayjs(updatedReminder.reminderDate)
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss");

      res.json(updatedReminder);
    } catch (error) {
      console.error('Update reminder error:', error);
      res.status(500).json({ error: 'Server error while updating reminder' });
    }
  },

  // Delete reminder
  deleteReminder: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const reminder = await Reminder.findOne({ where: { id, user_id: userId } });
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