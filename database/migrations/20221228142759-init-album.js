'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { INTEGER, DATE, STRING, BOOLEAN } = Sequelize;
    await queryInterface.createTable('album', {
      id: {
        type: INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: STRING(16),
      type: INTEGER(10),
      name: STRING(255),
      description: STRING(255),
      cover: {
        type: INTEGER(16),
        defaultValue: 1,
      },
      status: {
        type: INTEGER(4),
        defaultValue: 1, // 0 已删除，1 公开，2私有，
      },
      created_at: DATE,
      updated_at: DATE,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('album');
  }
};
