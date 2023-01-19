'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { INTEGER, STRING, DATE } = Sequelize;
    await queryInterface.createTable('home', {
      id: {
        type: INTEGER(10),
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: STRING(255),
      },
      desc: {
        type: STRING(255),
      },
      order: {
        type: INTEGER(10)
      },
      cover: {
        type: STRING(255)
      },
      status: {
        type: INTEGER(4)
      },
      created_at: DATE,
      updated_at: DATE,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('home');
  }
};
