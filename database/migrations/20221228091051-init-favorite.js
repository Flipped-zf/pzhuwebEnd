'use strict';

module.exports = {
  up:async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('favorite', {
      id: {
        type: INTEGER(10),
        primaryKey: true,
        autoIncrement: true,
      },
      userid: {
        type:STRING(16)
      },
      articleid:{
        type:INTEGER(10),
        references:{
          model:'Article'
        }
      },
      created_at: DATE,
      updated_at: DATE,
    })
  },

  down:async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('favorite');
  }
};
