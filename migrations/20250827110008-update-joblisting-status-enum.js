'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new values to the ENUM type
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.changeColumn(
        'job_listings',
        'status',
        {
          type: Sequelize.ENUM('saved', 'applied', 'archived', 'interviewing', 'accepted'),
          allowNull: false,
          defaultValue: 'saved',
        },
        { transaction }
      );
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert back to old ENUM values if rollback is needed
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.changeColumn(
        'job_listings',
        'status',
        {
          type: Sequelize.ENUM('saved', 'applied', 'archived'),
          allowNull: false,
          defaultValue: 'saved',
        },
        { transaction }
      );
    });
  }
};