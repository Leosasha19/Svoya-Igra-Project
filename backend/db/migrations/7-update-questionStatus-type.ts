'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Players", "questionStatus");
    await queryInterface.addColumn("Players", "questionStatus", {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {},
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Players", "questionStatus");
    await queryInterface.addColumn("Players", "questionStatus", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
