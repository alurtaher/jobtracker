const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Company = require("./Company");

const JobListing = sequelize.define(
  "JobListing",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    applyUrl: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM("open", "closed", "paused"),
      defaultValue: "open",
    },
  },
  {
    tableName: "job_listings",
    timestamps: true,
    underscored: true,
  }
);

Company.hasMany(JobListing, { foreignKey: "company_id" });
JobListing.belongsTo(Company, { foreignKey: "company_id" });

module.exports = JobListing;