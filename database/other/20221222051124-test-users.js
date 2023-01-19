'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const { INTEGER, DATE, STRING } = Sequelize;
        await queryInterface.createTable('users', {
            id: { type: STRING(16), primaryKey: true },
            password: STRING(32),
            name: STRING(16),
            email: STRING(32),
            status: { 
              type: INTEGER(4),
              references: {
                model: 'status',
                key: 'id',
              },
              defaultValue: 0,
              onUpdate: 'CASCADE', 
              onDelete: 'SET NULL', 
            },
            created_at: DATE,
            updated_at: DATE,
        });
    },

    // eslint-disable-next-line no-unused-vars
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('users');
    }
};
