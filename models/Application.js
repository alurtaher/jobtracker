// models/JobApplication.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User'); // your user model

const JobApplication = sequelize.define('JobApplication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jobTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  applicationDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('applied', 'interviewed', 'offered', 'rejected', 'accepted'),
    defaultValue: 'applied',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  resumePath: {
    // path or URL to resume attachment
    type: DataTypes.STRING,
    allowNull: true,
  },
  coverLetterPath: {
    // path or URL to cover letter attachment
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Set up relationship: a user can have many job applications
User.hasMany(JobApplication, { foreignKey: 'user_id' });
JobApplication.belongsTo(User, { foreignKey: 'user_id' });

module.exports = JobApplication;