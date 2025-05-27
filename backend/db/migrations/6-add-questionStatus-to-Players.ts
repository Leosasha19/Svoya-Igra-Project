'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('Players', 'questionStatus', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    })
  },

  async down (queryInterface, Sequelize) {
  return queryInterface.removeColumn('Players', 'questionStatus')
  }
};
