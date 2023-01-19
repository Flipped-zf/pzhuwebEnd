'use strict';

const Controller = require('egg').Controller;

class Achievement extends Controller {
  async getAchievement() {
    const { ctx, app } = this;
    try {
      let { beg, end, index, keywords } = ctx.query;
      beg = parseInt(beg);
      end = parseInt(end);
      index = parseInt(index);
      keywords = keywords === 'null' ? '' : keywords;
      const table = 'AchievementType';
      const table1 = 'Achievement';
      const params = {
        include: [
          {
            model: app.model.UserInfo,
            attributes: ['avatar'],
            include: [
              {
                model: app.model.User,
                attributes: ['name'],
              },
            ],
          },
        ],
        order: [['created_at', 'DESC']],
        where: {
          status: 1,
        },
      };
      const params1 = {
        where: {
          status: 1,
        },
      };
      let acType = await ctx.service.mysql.findAll(params1, table);
      let ac = await ctx.service.mysql.findAll(params, table1);
      acType = await ctx.service.fun.filterTypeNum(acType, ac);
      if (index !== 0) {
        ac = await ctx.service.fun.filterType(ac, index); // 过滤资源所对应的类别
      }
      ac = ac.filter(item => `${item.title}`.includes(keywords));
      if (parseInt(ac.length) >= end) {
        ac = ac.slice(beg, end);
        ctx.body = {
          success: 1,
          data: {
            acType,
            ac,
          },
        };
      } else {
        ac = ac.slice(beg);
        ctx.body = {
          success: 0,
          data: {
            acType,
            ac,
          },
        };
      }
    } catch (err) {
      ctx.status = 404;
      console.log(err);
    }
  }

}

module.exports = Achievement;
