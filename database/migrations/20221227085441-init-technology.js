'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('technology', {
      id: {
        type: INTEGER(10),
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: STRING(16)
      },
      status: {
        type: INTEGER(4),
        defaultValue: 1,
      },
      created_at: DATE,
      updated_at: DATE,
    })
  },

  down:async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('technology');
  }
};
