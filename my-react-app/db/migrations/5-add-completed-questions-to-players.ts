module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Players', 'completedQuestions', {
            type: Sequelize.JSONB,
            defaultValue: [],
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Players', 'completedQuestions');
    },
};