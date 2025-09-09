'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.sequelize.transaction(async (transaction) => {
      // 1. Rename old enum type (Postgres specific, for other DBs adjust accordingly)
      // Example for PostgreSQL:
      // await queryInterface.sequelize.query('ALTER TYPE enum_job_listings_status RENAME TO enum_job_listings_status_old;', { transaction });

      // 2. Change the column data type to the new ENUM
      await queryInterface.changeColumn(
        'job_listings',
        'status',
        {
          type: Sequelize.ENUM('open', 'closed', 'paused'),
          allowNull: false,
          defaultValue: 'open',
        },
        { transaction }
      );

      // 3. Update existing rows with unsupported values to 'open' (or other suitable mapping)
      await queryInterface.sequelize.query(
        "UPDATE job_listings SET status='open' WHERE status IN ('saved', 'applied', 'archived', 'interviewing', 'accepted');",
        { transaction }
      );

      // 4. (Optional) Drop the old ENUM type if needed (Postgres)
      // await queryInterface.sequelize.query('DROP TYPE enum_job_listings_status_old;', { transaction });
    });
  },

  async down (queryInterface, Sequelize) {
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

      // Revert status values if necessary
      await queryInterface.sequelize.query(
        "UPDATE job_listings SET status='saved' WHERE status IN ('open', 'closed', 'paused');",
        { transaction }
      );
    });
  }
};
