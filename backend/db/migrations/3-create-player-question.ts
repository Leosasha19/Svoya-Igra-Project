'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PlayerQuestions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      playerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Players',
          key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      questionId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Questions',
          key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      answered: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PlayerQuestions');
  }
};