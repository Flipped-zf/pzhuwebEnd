'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const { INTEGER, DATE, STRING } = Sequelize;
        await queryInterface.createTable('achievement_type', {
            id: {
                type: INTEGER(10),
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: STRING(16)
            },
            status: {
                type: INTEGER(4),
                defaultValue: 1,
            },
            created_at: DATE,
            updated_at: DATE,
        });
    },

    // eslint-disable-next-line no-unused-vars
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('achievement_type');
    }
};
