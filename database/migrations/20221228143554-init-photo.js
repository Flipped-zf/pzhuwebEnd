'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { INTEGER, DATE, STRING, BOOLEAN } = Sequelize;
    await queryInterface.createTable('photo', {
      id: {
        type: INTEGER(16),
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: STRING(16),
      album_id: INTEGER(16),
      link: STRING(255),
      name: STRING(255),
      status: {
        type: INTEGER(4),
        defaultValue: 1,
      },
      created_at: DATE,
      updated_at: DATE,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('photo');
  }
};
