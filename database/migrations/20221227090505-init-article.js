'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING,TEXT,TIME } = Sequelize;
    await queryInterface.createTable('article', {
      id: {
        type: INTEGER(10),
        primaryKey: true,
        autoIncrement: true,
      },
      userid:{
        type:STRING(16),
        references:{
          model:'users'
        }
      },
      title:{
        type:STRING(64)
      },
      menuid:{
        type:INTEGER(10),
        references:{
          model:'menu'
        }
      },
      technologyid:{
        type:INTEGER(10),
        references:{
          model:'Technology'
        }
      },
      introduction:{
        type:STRING(128)
      },
      keywords:{
        type:STRING(64)
      },
      postlink:{
        type:STRING(128)
      },
      raws: {
        type: TEXT
      },
      context:{
        type:TEXT
      },
      readnumber:{
        type:INTEGER(10)
      },
      status:{
        type:INTEGER(4)
      },
      tops:{
        type:INTEGER(4)
      },
      created_at: DATE,
      updated_at: DATE,
    })
  },

  down:async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('article');
  }
};
