const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  industry: {
    type: DataTypes.STRING,
  },
  size: {
    type: DataTypes.STRING,
  },
  contactInfo: {
    type: DataTypes.STRING,
  },
  notes: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'companies',
  timestamps: true,
  underscored: true,
});

User.hasMany(Company, { foreignKey: 'user_id' });
Company.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Company;