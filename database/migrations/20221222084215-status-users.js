'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('status', {
      id: { type: INTEGER, primaryKey: true },
      roles: STRING(32),
      auth_btn: STRING(64),
      active:  INTEGER,
      roleName: STRING(32),
      describe: STRING(64),
      created_at: DATE,
      updated_at: DATE,
    }).then(() => {
        queryInterface.createTable('users', {
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
          active: INTEGER,
          created_at: DATE,
          updated_at: DATE,
      });
    }) 
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
      await queryInterface.dropTable('users').then(() => {
      queryInterface.dropTable('status')
    }) 
  }
};
