'use strict';

const Controller = require('egg').Controller;

class ArticleEdit extends Controller {
  async getArticleEdit() {
    const { ctx, app } = this;
    try {
      const { id } = ctx.request.body;
      const userid = ctx.session.userid;
      const table = 'Menu';
      const table1 = 'Technology';
      const table2 = 'Article';
      const menu = await ctx.service.mysql.findAll({ where: { status: 1 } }, table);
      const technology = await ctx.service.mysql.findAll({ where: { status: 1 } }, table1);
      const params = {
        include: [
          {
            model: app.model.Menu
          },
          {
            model: app.model.Technology
          }
        ],
        where: {
          userid,
          status: 2
        }
      };
      const params2 = {
        where: {
          id,
          userid
        }
      };
      let article;
      if (id === 0) {
        article = await ctx.service.mysql.findAll(params, table2);// 查找上次未编写完的文章
      } else {
        article = await ctx.service.mysql.findAll(params2, table2);// 用户编辑文章
      }
      if (article.length === 0) {
        article = await ctx.service.mysql.create({ userid, status: 2 }, table2);
        ctx.status = 200;
        ctx.body = {
          success: 1,
          data: {
            menu,
            technology,
            article
          }
        };
      } else {
        ctx.status = 200;
        ctx.body = {
          success: 0,
          data: {
            menu,
            technology,
            article,
          }
        };
      }
      
    } catch (err) {
      console.log(err);
      ctx.status = 404;
    }
  }
  async uploadArticleInfo() {
    const { ctx } = this;
    try {
      const { id, title, status, abstract, context, postlink,raws, technologyid, keywords, menuid, date,delimglist } = ctx.request.body;
      const created_at = new Date(date);
      delimglist && delimglist.forEach((item)  => { ctx.service.qiniu.deleteFile('webimg', item)})
      const userid = ctx.session.userid;
      const table = 'Article';
      const params = {
        where: {
          id,
          userid
        }
      };
      const params1 = {
        id,
        userid,
        title,
        raws: raws.join(','),
        context,
        postlink,
        status: 1,
        technologyid,
        menuid,
        keywords,
        abstract,
        created_at
      };
      let article;
      if (parseInt(status) === 1) {
        article = await ctx.service.mysql.create(params1, table);
      } else {
        article = await ctx.service.mysql.findAll(params, table);
        await article[0].update(params1);
      }
      ctx.status = 200;
      ctx.body = {
        success: 1,
      };
    } catch (err) {
      console.log(err);
      ctx.status = 404;
    }
  }
  async uploadArticleeCover() {
    const { ctx } = this;
    try {
      const { id, status, key } = ctx.request.body;
      const userid = ctx.session.userid;
      const table = 'Article';
      const postlink = await ctx.service.qiniu.getCDN(key);
      const params = {
        userid,
        postlink,
        status: 2
      };
      let article;
      if (parseInt(status) === 1) {
        article = await ctx.service.mysql.create(params, table);
      } else {
        article = await ctx.service.mysql.findByPk(id, table);
        await article.update(params);
      }
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
        success: 1,
        message: '封面删除成功'
      };
    } catch (err) {
      console.log(err);
      ctx.status = 404;
    }
  }
  async uploadArticleResource() {
    const { ctx } = this;
    try {
      const { id, key } = ctx.request.body;
      const userid = ctx.session.userid;
      const link = await ctx.service.qiniu.getCDN(key);
      const table = 'Media';
      const params = {
        articleid: id,
        userid,
        link,
        key
      };
      const media = await ctx.service.mysql.create(params, table);
      ctx.status = 200;
      ctx.body = {
        success: 1,
        data: media
      };
      
    } catch (err) {
      ctx.status = 404;
      console.log(err);
    }
  }
  async getMediaItems() {
    const { ctx } = this;
    try {
      const table = 'Media';
      const userid = ctx.session.userid;
      const mediaItems = await ctx.service.mysql.findAll({ where: { userid, status: 1 } }, table);
      ctx.status = 200;
      ctx.body = {
        success: 1,
        data: mediaItems
      };
    } catch (err) {
      console.log(err);
      ctx.status = 404;
    }
  }
  async removeMedia() {
    const { ctx, app } = this;
    const { Op } = app.Sequelize;
    try {
      const { data } = ctx.request.body;
      const table = 'Media';
      const arry = data.map(item => {
        return {
          id: item.id
        };
      });
      const params = {
        where: {
          [Op.or]: arry
        }
      };
      const media = await ctx.service.mysql.findAll(params, table);
      for (const item of media) {
        await item.update({ status: 0 });
      }
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

module.exports = ArticleEdit;
