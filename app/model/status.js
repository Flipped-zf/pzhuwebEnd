'use strict';

module.exports = app => {
  const { INTEGER, DATE, STRING } = app.Sequelize;
  const Status = app.model.define(
    'Status',
    {
      id: { type: INTEGER, primaryKey: true },
      roles: STRING(32),
      auth_btn: STRING(64),
      active:  INTEGER,
      roleName: STRING(32),
      describe: STRING(64)
    },
    {
      // freezeTableName: true,停止 Sequelize 执行自动复数化. 这样,Sequelize 将推断表名称等于模型名称
      tableName: 'status'
    }
  );
  Status.associate = function() {
    app.model.Status.hasOne(app.model.User, { foreignKey: 'status', sourceKey: 'id' });
  };
  return Status; 
};
