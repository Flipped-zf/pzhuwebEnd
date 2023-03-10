'use strict';

const Controller = require('egg').Controller;

class Resource extends Controller {
  async getResource() {
    const { ctx, app } = this;
    try {
      let { beg, end, index, keywords } = ctx.query;
      beg = parseInt(beg);
      end = parseInt(end);
      index = parseInt(index);
      keywords = keywords === 'null' ? '' : keywords;
      const table = 'ResourceType';
      const table1 = 'Resource';
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
          status: 1
        }
      };
      const params1 = {
        where: {
          status: 1
        }
      };
      let resourceType = await ctx.service.mysql.findAll(params1, table);
      let resource = await ctx.service.mysql.findAll(params, table1);
      resourceType = await ctx.service.fun.filterTypeNum(resourceType, resource);// 过滤类别所对应的数目
      if (index !== 0) {
        resource = await ctx.service.fun.filterType(resource, index);// 过滤资源所对应的类别
      }
      ctx.status = 200;
      resource = resource.filter(item => item.title.includes(keywords));
      if (parseInt(resource.length) >= end) {
        resource = resource.slice(beg, end);
        ctx.body = {
          success: 1,
          data: {
            resourceType,
            resource
          }
        };
      } else {
        resource = resource.slice(beg);
        ctx.body = {
          success: 0,
          data: {
            resourceType,
            resource
          }
        };
      }
    } catch (err) {
      console.log(err);
      ctx.status = 404;
    }
  }
}

module.exports = Resource;
