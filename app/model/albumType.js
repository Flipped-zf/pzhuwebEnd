'use strict';

module.exports = app => {
  const { INTEGER, DATE, STRING } = app.Sequelize;
  const AlbumType = app.model.define(
    'AlbumType',
    {
      id: {
        type: INTEGER(10),
        primaryKey: true,
        autoIncrement: true,
      },
      name: STRING(255),
      status: {
        type: INTEGER(4),
        defaultValue: 1,
      },
      created_at: DATE,
      updated_at: DATE,
    },
    {
      freezeTableName: true,
      tableName: 'album_type'
    }
  );

  return AlbumType;
};
