'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const {
      INTEGER,
      DATE,
      STRING
    } = Sequelize;
    await queryInterface.createTable('user_info', {
      id: {
        type: STRING(16),
        primaryKey: true,
        references: {
          model: 'users',
          key: 'id',
          onUpdate: 'CASCADE', 
          onDelete: 'SET NULL', 
        }
      },
      school: {
        type: INTEGER(10),
        references: {
          model: 'school',
          key: 'id',
          onUpdate: 'CASCADE', 
          onDelete: 'SET NULL', 
        }
      },
      major: {
        type: INTEGER(10),
        references: {
          model: 'major',
          key: 'id',
          onUpdate: 'CASCADE', 
          onDelete: 'SET NULL', 
        }
      },
      domain: {
        type: INTEGER(10),
        references: {
          model: 'domain',
          key: 'id',
          onUpdate: 'CASCADE', 
          onDelete: 'SET NULL', 
        }
      },
      avatar: STRING(128),
      phone: STRING(11),
      description: STRING(128),
      job: STRING(128),
      good: STRING(128),
      resume: STRING(128),
      home_page: STRING(128),
      created_at: DATE,
      updated_at: DATE,
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_info');
  }
};
