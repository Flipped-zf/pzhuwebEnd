'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('status', {
      id: { type: INTEGER, primaryKey: true },
      roles: STRING(32),
      AuthBtn: STRING(32),
      created_at: DATE,
      updated_at: DATE,
  });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('status');
  }
};
