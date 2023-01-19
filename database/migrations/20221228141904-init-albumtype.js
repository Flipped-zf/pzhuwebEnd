'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { INTEGER, DATE, STRING, BOOLEAN } = Sequelize;
    await queryInterface.createTable('album_type', {
      id: {
        type: INTEGER(10),
        primaryKey: true,
        autoIncrement: true,
      },
      name: STRING(255),
      status: {
        type: INTEGER(4),
        defaultValue: 1
      },
      created_at: DATE,
      updated_at: DATE,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('album_type');
  }
};
