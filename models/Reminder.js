const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const JobApplication = require('./Application');

const Reminder = sequelize.define('Reminder', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  reminderDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  notified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'reminders',
  timestamps: true,
  underscored: true,
});

User.hasMany(Reminder, { foreignKey: 'user_id' });
Reminder.belongsTo(User, { foreignKey: 'user_id' });

JobApplication.hasMany(Reminder, { foreignKey: 'job_application_id' });
Reminder.belongsTo(JobApplication, { foreignKey: 'job_application_id' });

module.exports = Reminder;