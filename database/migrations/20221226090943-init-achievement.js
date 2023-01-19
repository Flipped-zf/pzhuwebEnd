'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const { INTEGER, DATE, STRING, BOOLEAN,TEXT } = Sequelize;
        await queryInterface.createTable('achievement', {
            id: {
                type: INTEGER(10),
                primaryKey: true,
                autoIncrement: true
            },
            userid: {
              type: STRING(16),
              references: {
                  model: 'user_info'
              },
              onUpdate: 'CASCADE', 
              onDelete: 'SET NULL', 
            },
            title: {
                type: STRING(64)
            },
            typeid: {
                type: INTEGER(10),
                references: {
                    model: 'achievement_type'
                },
                onUpdate: 'CASCADE', 
                onDelete: 'SET NULL', 
            },
            introduction: {
                type: STRING(128),
            },
            posterlink: {
                type: STRING(128)
            },
            achievementlink: {
                type: TEXT
            },
            attachment: {
                type: STRING(128)
            },
            status: {
                type: BOOLEAN(4),
                defaultValue: 0
            },
            created_at: DATE,
            updated_at: DATE,
            show: {
              type: INTEGER(2),
              defaultValue: 0
            },
        });
    },

    // eslint-disable-next-line no-unused-vars
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('achievement');
    }
};
