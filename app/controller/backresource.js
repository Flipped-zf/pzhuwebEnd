'use strict';

const Controller = require('egg').Controller;

class Resource extends Controller {
  async getResourceInfo() {
    const { ctx, app } = this;
    const { Op } = app.Sequelize;
    try {
      let { page, pageSize,keywords,mytag } = ctx.request.body;
      page = parseInt(page);
      pageSize = parseInt(pageSize);
      const table = 'Resource';
      const table1 = 'ResourceType';
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
          }, {
            model: app.model.ResourceType
          }
        ],
        where: {
          status: 1,
          title: {
            [Op.like]: '%' +keywords+'%',
          },
          typeid: {
            [mytag ? Op.in:Op.notIn]: [mytag]
          }
        },
        attributes: ['id', 'title', 'link', 'attachment', 'created_at'],
        order: [['created_at', 'DESC']],
        limit: pageSize,
        offset: (page - 1) * pageSize,
      };
      const params1 = {
        where: {
          status: 1,
          title: {
            [Op.like]: '%' +keywords+'%',
          },
          typeid: {
            [mytag ? Op.in:Op.notIn]: [mytag]
          }
        }
      };
      const params2 = {
        where: {
          status: 1
        }
      }
      const Resource = await ctx.service.mysql.findAll(params, table);
      const allResource = await ctx.service.mysql.findAll(params1, table);
      const tag = await ctx.service.mysql.findAll(params2, table1);
      const total = allResource.length;
      ctx.status = 200;
      ctx.body = {
        success: 1,
        data: {
          Resource,
          total,
          tag
        }
      };
    } catch (err) {
      console.log(err);
      ctx.status = 404;
    }
  }
  async delResource() {
    const { ctx } = this;
    try {
      const { id } = ctx.request.body;
      const table = 'Resource';
      const Resource = await ctx.service.mysql.findByPk(id, table);
      await Resource.update({ status: 0 });
      ctx.status = 200;
      ctx.body = {
        success: 1,
        message: '删除成功'
      };
    } catch (err) {
      console.log(err);
      ctx.status = 404;
    }
  }
  async addResourceTag() {
    const { ctx } = this;
    try {
      const { tagName } = ctx.request.body;
      const table = 'ResourceType';
      const params = {
        where: {
          name: tagName
        }
      };
      const isTag = await ctx.service.mysql.findAll(params, table);
      if (isTag.length !== 0) {
        // 标签已存在
        if (isTag[0].dataValues.status === 1) {
          ctx.status = 200;
          ctx.body = {
            success: 0,
            message: '标签已存在'
          };
          // 标签恢复
        } else if (isTag[0].dataValues.status === 0) {
          await isTag[0].update({ status: 1 });
          ctx.status = 200;
          ctx.body = {
            success: 1,
            tag: isTag[0],
            message: '标签已恢复'
          };
        }
      } else {
        const tag = await ctx.service.mysql.create({ name: tagName }, table);
        ctx.status = 200;
        ctx.body = {
          success: 1,
          tag: tag,
          message: '标签添加成功'
        };
      }
    } catch (err) {
      console.log(err);
      ctx.status = 404;
    }
  }
  async delResourceTag() {
    const { ctx } = this;
    try {
      const { tagid } = ctx.request.body;
      const table = 'ResourceType';
      const resource = await ctx.service.mysql.findByPk(tagid, table);
      await resource.update({ status: 0 });
      ctx.status = 200;
      ctx.body = {
        success: 1,
        message: '删除成功',
        data: resource
      };
    } catch (err) {
      console.log(err);
      ctx.status = 404;
    }
  }
}
module.exports = Resource;
