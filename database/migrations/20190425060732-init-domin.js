'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('domain', {
      id: {
        type: INTEGER(10),
        primaryKey: true
      },
      name: {
        type: STRING(16)
      },
      created_at: DATE,
      updated_at: DATE,
    })
  },

  down:async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('domain');
  }
};
