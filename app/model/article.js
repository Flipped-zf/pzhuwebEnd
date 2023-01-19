'use strict';

module.exports = app => {
  const { INTEGER, STRING, DATE, TEXT } = app.Sequelize;
  const Article = app.model.define(
    'Article',
    {
      id: {
        type: INTEGER(10),
        primaryKey: true,
        autoIncrement: true
      },
      userid: {
        type: STRING(16),
        references: {
          model: 'UserInfo',
        },
      },
      title: {
        type: STRING(64),
      },
      menuid: {
        type: INTEGER(10),
        references: {
          model: 'Menu',
        },
      },
      technologyid: {
        type: INTEGER(10),
        references: {
          model: 'Technology',
        },
      },
      introduction: {
        type: STRING(128),
      },
      keywords: {
        type: STRING(64),
      },
      postlink: {
        type: STRING(128),
      },
      raws: {
        type: TEXT
      },
      context: {
        type: TEXT,
      },
      readnumber: {
        type: INTEGER(10),
        defaultValue: 1
      },
      status: {
        type: INTEGER(4),
      },
      tops: {
        type: INTEGER(4),
      },
      created_at: DATE,
      updated_at: DATE,
    },
    {
      timestamps: false,
      underscored: true,
      tableName: 'article',
    }
  );
  Article.associate = function() {
    app.model.Article.hasMany(app.model.Media, { foreignKey: 'articleid', sourceKey: 'id' });
    app.model.Article.hasMany(app.model.Favorite, { foreignKey: 'articleid', sourceKey: 'id' });
    app.model.Article.belongsTo(app.model.UserInfo, { foreignKey: 'userid', targetKey: 'id' });
    app.model.Article.belongsTo(app.model.Menu, { foreignKey: 'menuid', targetKey: 'id' });
    app.model.Article.belongsTo(app.model.Technology, { foreignKey: 'technologyid', targetKey: 'id' });

  };
  return Article;
};
