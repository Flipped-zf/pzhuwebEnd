'use strict';

module.exports = app => {
  const { INTEGER, DATE, STRING } = app.Sequelize;
  const User = app.model.define(
    'User',
    {
      id: { // -1禁用 0审核 1成员 2admin 3common(老师)
        type: STRING(16),
        primaryKey: true,
      },
      password: STRING(32),
      name: STRING(32),
      email: STRING(32),
      status: {
        type: INTEGER(4),
        defaultValue: 0,
        references: {
          model: 'status',
          key: 'id'
        },
      },
      active:  INTEGER,
    },
    {
      // freezeTableName: true,
      tableName: 'users'
    }
  );
  User.associate = function() {
    app.model.User.belongsTo(app.model.Status, { foreignKey: 'status', targetKey: 'id' });
    app.model.User.hasMany(app.model.UserInfo, { foreignKey: 'id', sourceKey: 'id' });  };
  return User;
};
