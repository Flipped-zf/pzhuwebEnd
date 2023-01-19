'use strict';

const Controller = require('egg').Controller;

class Article extends Controller {
  async getArticle() {
    const { ctx, app } = this;
    try {
      let  beg, end, index, keywords ;
      beg = parseInt(ctx.params.beg);
      end = parseInt(ctx.params.end);
      index = parseInt(ctx.params.index);
      keywords = ctx.params.keywords === 'null' ? '':ctx.params.keywords;
      const table = 'Technology';
      const table1 = 'Article';
      const params = { 
        include: [
          {
            model: app.model.Menu,
          },
          {
            model: app.model.Technology,
          },
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
        attributes: { exclude: ['context', 'raws'] },
        where: {
          status: 1,
        },
        order: [['created_at', 'DESC']],
      };
      const params1 = {
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
        where: {
          status: 1,
        },
        attributes: { exclude: ['context', 'raws'] },
        order: [['readnumber', 'DESC']],
        limit: 10
      };
      const technology = await ctx.service.mysql.findAll({ where: { status: 1 } }, table);
      let article = await ctx.service.mysql.findAll(params, table1);
      let technologyGroup = await ctx.service.fontFun.articleGroup(article,technology)
      let hotArticle = await ctx.service.mysql.findAll(params1, table1);
      if (index !== 0) {
        article = article.filter(item => {
          return item.dataValues.technologyid === parseInt(index);
        });
      }
      const slideshow = article.filter(item => {
        return item.dataValues.tops === 1;
      });
      // hotArticle = hotArticle.splice(0, 10);
      article = article.filter(item => item.title.includes(keywords));
      if (parseInt(article.length) > end) {
        article = article.slice(beg, end);
        ctx.status = 200;
        ctx.body = {
          success: 1,
          data: {
            technology,
            article,
            slideshow,
            hotArticle,
            technologyGroup
          },
        };
      } else {
        article = article.slice(beg);
        ctx.status = 200;
        ctx.body = {
          success: 0,
          data: {
            technology,
            article,
            slideshow,
            hotArticle,
            technologyGroup
          },
        };
      }
    } catch (err) {
      console.log(err);
      ctx.status = 404;
    }
  }
  async collectArticle() {
    const { ctx } = this;
    try {
      const token = ctx.header.authorization;
      const author = await ctx.service.jwt.verifyToken(token);
      if (!author) {
        ctx.status = 403;
      } else {
        const { id } = ctx.request.body;
        const userid = ctx.session.userid;
        const table = 'Favorite';
        const params = {
          articleid: id,
          userid,
        };
        await ctx.service.mysql.create(params, table);
        ctx.status = 200;
        ctx.body = {
          success: 1,
        };
      }
    } catch (err) {
      console.log(err);
      ctx.status = 404;
    }
  }
  async cancelCollect() {
    const { ctx } = this;
    try {
      const token = ctx.header.authorization;
      const author = await ctx.service.jwt.verifyToken(token);
      if (!author) {
        ctx.status = 403;
      } else {
        const { id } = ctx.request.body;
        const userid = ctx.session.userid;
        const table = 'Favorite';
        const params = {
          where: {
            articleid: id,
            userid,
          },
        };
        const favorite = await ctx.service.mysql.findAll(params, table);
        await favorite[0].destroy();
        ctx.status = 200;
        ctx.body = {
          success: 1,
        };
      }
    } catch (err) {
      console.log(err);
      ctx.status = 404;
    }
  }
}

module.exports = Article;
