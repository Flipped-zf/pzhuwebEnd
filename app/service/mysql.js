'use strict';
const Service = require('egg').Service;
class UserService extends Service {
  // 插入数据
  async create(params, table) {
    const { ctx } = this;
    const result = await ctx.model[table].create(params);
    return result;
  }
  async createList(params, table) {
    const { ctx } = this;
    const result = await ctx.model[table].bulkCreate(params);
    return result;
  }
  // 通过ID查找数据
  async findByPk(params, table) {
    const { ctx } = this;
    const result = await ctx.model[table].findByPk(params);
    return result;
  }
  // 条件查询
  async findAll(params, table) {
    const { ctx } = this;
    const result = await ctx.model[table].findAll(params);
    return result;
  }
  async findOne(id, table,table2) {
    const { ctx } = this;
    const result = ctx.model[table].findOne({
      where: {
        id, 
      },
      include: {model: ctx.model[table2]}
    })
    return result;
  }
  async deleteById(id, table) {
    const { ctx } = this;
    const result = ctx.model[table].destroy({
      where: {
        id, 
      }
    })
    return result;
  }
}

module.exports = UserService;
