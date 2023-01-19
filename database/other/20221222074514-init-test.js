'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const { INTEGER, DATE, STRING } = Sequelize;
        await queryInterface.createTable('tests', {
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
              onUpdate: 'CASCADE', // 外键更新约束 CASCADE RESTRICT SET NULL SET DEFAULT NO ACTION
              onDelete: 'SET NULL', // 外键删除约束 CASCADE RESTRICT SET NULL SET DEFAULT NO ACTION
            },
            created_at: DATE,
            updated_at: DATE,
        });
    },

    // eslint-disable-next-line no-unused-vars
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('tests');
    }
};
