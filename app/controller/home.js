'use strict';

const Controller = require('egg').Controller;

class Home extends Controller {
  async getHomeInfo() {
    const { ctx, app } = this;
    try {
      const table = 'Achievement';// 获取团队的成果
      const params = {
        include: [
          {
            model: app.model.UserInfo,
            attributes: ['avatar'],
            include: [
              {
                model: app.model.User,
                attributes: ['name']
              }
            ]
          }
        ],
        order: [['created_at', 'DESC']],
        where: {
          show: 1,
          status: 1
        }
      };
      const ac = await ctx.service.mysql.findAll(params, table);
      const baseInfo = await ctx.service.mysql.findAll({
        attributes: ['title','cover','desc','order'],
      }, 'Home');
      ctx.status = 200;
      ctx.body = {
        success: 1,
        ac,
        baseInfo,
      };
    } catch (err) {
      console.log(err);
      ctx.status = 404;
    }
  }
  async getHomeuser() {
    const { ctx, app } = this;
    const { Op } = app.Sequelize;
    try {
      const params = {
        include: [
          {
            model: app.model.User,
            attributes: ['name'],
            where: {
              status: {
                [Op.gt]: 0
              }
            }
          }
        ]
      }
      const table = 'UserInfo';// 获取团队的成果
      const userinfo = await ctx.service.mysql.findAll(params, table);
      ctx.status = 200;
      ctx.body = {
        userinfo,
      };
    } catch (error) {
      console.log(error);
      ctx.status = 404;
    }
  }
}

module.exports = Home;
