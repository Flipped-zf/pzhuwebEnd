'use strict';
module.exports = app => {
  const { INTEGER, STRING } = app.Sequelize;
  const Technology = app.model.define(
    'Technology',
    {
      id: {
        type: INTEGER(10),
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: STRING(16),
      },
      status: {
        type: INTEGER(4),
        defaultValue: 1,
      },
    },
    {
      timestamps: false,
      underscored: true,
      tableName: 'technology',
    },
  );
  Technology.associate = function() {
    app.model.Technology.hasMany(app.model.Article, { foreignKey: 'technologyid', sourceKey: 'id' });
  };

  return Technology;
};
