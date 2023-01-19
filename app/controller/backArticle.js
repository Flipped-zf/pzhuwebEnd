'use strict';

const Controller = require('egg').Controller;

class Article extends Controller {
  async getArticleInfo() {
    const { ctx, app } = this;
    const { Op } = app.Sequelize;
    try {
      let { page, pageSize,keywords,mytag } = ctx.request.body;
      page = parseInt(page);
      pageSize = parseInt(pageSize);
      const table = 'Article';
      const table1 = 'Technology';
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
            model: app.model.Technology
          }
        ],
        where: {
          status: 1,
          title: {
            [Op.like]: '%' +keywords+'%',
          },
          technologyid: {
            [mytag ? Op.in:Op.notIn]: [mytag]
          }
        },
        attributes: ['id', 'title', 'keywords', 'tops', 'updated_at', 'created_at'],
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
          technologyid: {
            [mytag ? Op.in:Op.notIn]: [mytag]
          }
        }
      };
      const params2 = {
        where: {
          status: 1
        }
      }
      const articleList = await ctx.service.mysql.findAll(params, table);
      const allArticle = await ctx.service.mysql.findAll(params1, table);
      const tag = await ctx.service.mysql.findAll(params2, table1);
      const total = allArticle.length;
      ctx.status = 200;
      ctx.body = {
        success: 1,
        data: {
          articleList,
          total,
          tag
        }
      };
    } catch (err) {
      console.log(err);
      ctx.status = 404;
    }
  }
  async istop() {
    const { ctx } = this;
    try {
      const { checked, id } = ctx.request.body;
      const table = 'Article';
      const article = await ctx.service.mysql.findByPk(id, table);
      if (checked) {
        await article.update({ tops: 1 });
      } else {
        await article.update({ tops: 0 });
      }
      ctx.status = 200;
      ctx.body = {
        success: 1,
        message: '设置成功'
      };
    } catch (err) {
      console.log(err);
      ctx.status = 404;
    }
  }
  async deleteArticle() {
    const { ctx } = this;
    try {
      const { id } = ctx.request.body;
      const table = 'Article';
      const article = await ctx.service.mysql.findByPk(id, table);
      await article.update({ status: 0 });
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
  async delArticleTag() {
    const { ctx } = this;
    try {
      const { tagid } = ctx.request.body;
      const table = 'Technology';
      const tc = await ctx.service.mysql.findByPk(tagid, table);
      await tc.update({ status: 0 });
      ctx.status = 200;
      ctx.body = {
        success: 1,
        data: tc,
        message: '删除成功'
      };
    } catch (err) {
      console.log(err);
      ctx.status = 404;
    }
  }
  async addArticleTag() {
    const { ctx } = this;
    try {
      const { tagName } = ctx.request.body;
      const table = 'Technology';
      const params = {
        where: {
          name: tagName
        }
      };
      const isTec = await ctx.service.mysql.findAll(params, table);
      if (isTec.length !== 0) {
        // 标签已存在
        if (isTec[0].dataValues.status === 1) {
          ctx.status = 200;
          ctx.body = {
            success: 0,
            message: '标签已存在'
          };
          // 标签恢复
        } else if (isTec[0].dataValues.status === 0) {
          await isTec[0].update({ status: 1 });
          ctx.status = 200;
          ctx.body = {
            success: 1,
            tag: isTec[0],
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
  async getArticleEdit() {
    const { ctx } = this;
    try {
      const { id } = ctx.request.body;
      const table = 'Menu';
      const table1 = 'Technology';
      const table2 = 'Article';
      const menu = await ctx.service.mysql.findAll({ where: { status: 1 } }, table);
      const technology = await ctx.service.mysql.findAll({ where: { status: 1 } }, table1);
      const params = {
        where: {
          id
        }
      };
      const article = await ctx.service.mysql.findAll(params, table2);// 用户编辑文章
      if (article.length !== 0) {
        ctx.status = 200;
        ctx.body = {
          success: 1,
          data: {
            menu,
            technology,
            article,
          }
        };
      } else {
        ctx.status = 200;
        ctx.body = {
          success: 0,
          message: '文章不存在'
        };
      }
    } catch (err) {
      ctx.status = 404;
      console.log(err);
    }
  }
  async uploadArticleInfo() {
    const { ctx } = this;
    try {
      const { id, title, abstract, context, postlink,raws, technologyid, keywords, menuid, date,delimglist } = ctx.request.body;
      const created_at = new Date(date);
      delimglist && delimglist.forEach((item)  => { ctx.service.qiniu.deleteFile('webimg', item)})
      const table = 'Article';
      const params = {
        where: {
          id
        }
      };
      const params1 = {
        id,
        title,
        raws: raws.join(','),
        context,
        postlink,
        technologyid,
        menuid,
        keywords,
        abstract,
        created_at
      };
      const article = await ctx.service.mysql.findAll(params, table);
      await article[0].update(params1);
      ctx.status = 200;
      ctx.body = {
        success: 1,
        message: '文章编辑成功'
      };
    } catch (err) {
      console.log(err);
      ctx.status = 404;
    }
  }
  async uploadArticleeCover() {
    const { ctx } = this;
    try {
      const { id, key } = ctx.request.body;
      const table = 'Article';
      const postlink = await ctx.service.qiniu.getCDN(key);
      const params = {
        postlink,
      };
      const article = await ctx.service.mysql.findByPk(id, table);
      await article.update(params);
      ctx.status = 200;
      ctx.body = {
        success: 1,
        data: article
      };
    } catch (err) {
      console.log(err);
      ctx.state = 404;
    }
  }
  async delCoverImg() {
    const { ctx } = this;
    try {
      const { id, postlink } = ctx.request.body;
      const table = 'Article';
      const params = {
        postlink: ''
      };
      const article = await ctx.service.mysql.findByPk(id, table);
      await article.update(params);
      await ctx.service.qiniu.deleteFile('webimg', postlink);
      ctx.status = 200;
      ctx.body = {
        success: 1
      };
    } catch (err) {
      console.log(err);
      ctx.status = 404;
    }
  }
}
module.exports = Article;
