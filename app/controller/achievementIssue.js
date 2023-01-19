'use strict';

const Controller = require('egg').Controller;

class AchievementIssue extends Controller {
  async getAchievementIssue() {
    const { ctx, app } = this;
    try {
      const { id } = ctx.request.body;
      const userid = ctx.session.userid;
      const table = 'AchievementType';
      const table1 = 'Achievement';
      const params = {
        include: [
          {
            model: app.model.AchievementType
          }
        ],
        where: {
          userid,
          status: 2
        }
      };
      const params1 = {
        where: {
          id,
          userid
        }
      };
      const params2 = {
        where: {
          status: 1
        }
      };
      const achievementType = await ctx.service.mysql.findAll(params2, table);
      let achievement;
      if (id === 0) {
        achievement = await ctx.service.mysql.findAll(params, table1);
      } else {
        achievement = await ctx.service.mysql.findAll(params1, table1);
      }

      if (achievement.length === 0) {
        ctx.status = 200;
        ctx.body = {
          success: 1,
          data: achievementType
        };
      } else {
        ctx.status = 200;
        ctx.body = {
          success: 0,
          data: {
            achievementType,
            achievement
          }
        };
      }
      
    } catch (err) {
      ctx.status = 404;
      console.log(err);
    }
  }
  async uploadAchievement() {
    const { ctx } = this;
    try {
      let { id, title, achievementlink, introduction, typeid, status, date } = ctx.request.body;
      id = parseInt(id);
      const userid = ctx.session.userid;
      const created_at = new Date(date);
      const table = 'Achievement';
      const params = {
        userid,
        title,
        achievementlink,
        typeid: parseInt(typeid),
        introduction,
        status: 1,
        created_at,
      };
      if (parseInt(status) === 1) {
        await ctx.service.mysql.create(params, table);
      } else {
        const achievement = await ctx.service.mysql.findByPk(id, table);
        await achievement.update(params);
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
  async uploadAchievementCover() {
    const { ctx } = this;
    try {
      let { id, key, status } = ctx.request.body;
      id = parseInt(id);
      const userid = ctx.session.userid;
      const posterlink = await ctx.service.qiniu.getCDN(key);
      const table = 'Achievement';
      const params = {
        userid,
        posterlink,
        status:2
      };
      let achievement;
      if (parseInt(status) === 1) {
        achievement = await ctx.service.mysql.create(params, table);
      } else {
        achievement = await ctx.service.mysql.findByPk(id, table);
        await achievement.update(params);
      }
      ctx.status = 200;
      ctx.body = {
        success: 1,
        data: achievement
      };
      
    } catch (err) {
      console.log(err);
      ctx.status = 404;
    }
  }
  async delAchievementCover() {
    const { ctx } = this;
    try {
      const { id, posterlink } = ctx.request.body;
      const table = 'Achievement';
      const params = {
        posterlink: ''
      };
      const achievement = await ctx.service.mysql.findByPk(id, table);
      await achievement.update(params);
      await ctx.service.qiniu.deleteFile('webimg', posterlink);
      ctx.status = 200;
      ctx.body = {
        success: 1
      };
      
    } catch (err) {
      console.log(err);
      ctx.status = 404;
    }
  }
  async uploadAchievementAttachment() {
    const { ctx } = this;
      let { id, key, status } = ctx.request.body;
      id = parseInt(id);
      const userid = ctx.session.userid;
      const attachment = await ctx.service.qiniu.getCDN(key);
      const table = 'Achievement';
      const params = {
        userid,
        attachment,
        status: 2
      };
      let achievement;
      if (parseInt(status) === 1) {
        achievement = await ctx.service.mysql.create(params, table);
      } else {
        achievement = await ctx.service.mysql.findByPk(id, table);
        await achievement.update(params);
      }
      ctx.status = 200;
      ctx.body = {
        success: 1,
        data: achievement
      };
  }
  async delAchievementAttachment() {
    const { ctx } = this;
    try {
      let { id, attachment } = ctx.request.body;
      id = parseInt(id);
      const table = 'Achievement';
      const params = {
        attachment: ''
      };
      const achievement = await ctx.service.mysql.findByPk(id, table);
      await achievement.update(params);
      await ctx.service.qiniu.deleteFile('webimg', attachment);
      ctx.status = 200;
      ctx.body = {
        success: 1
      };
      
    } catch (err) {
      console.log(err);
      ctx.status = 404;
    }
  }
  async uploadAchievement2() {
    const { ctx } = this;
    try {
      let { id, title, achievementlink,typeid, introduction, status, date,posterlink,attachment } = ctx.request.body;
      id = parseInt(id);
      const userid = ctx.session.userid;
      const created_at = new Date(date);
      const table = 'Achievement';
      const strRegex = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/|www\.)/;
			const re = new RegExp(strRegex);
      if(posterlink && !re.test(posterlink)) posterlink = await ctx.service.qiniu.getCDN(posterlink);
      if(attachment && !re.test(attachment)) attachment = await ctx.service.qiniu.getCDN(attachment);
      const params = {
        userid,
        title,
        achievementlink,
        typeid: parseInt(typeid),
        introduction,
        status: 1,
        created_at,
        posterlink,
        attachment
      };
      if (parseInt(status) === 1) {
        await ctx.service.mysql.create(params, table);
      } else {
        const achievement = await ctx.service.mysql.findByPk(id, table);
        try {
            achievement.dataValues.posterlink && await ctx.service.qiniu.deleteFile('webimg', achievement.dataValues.posterlink);
            achievement.dataValues.attachment && await ctx.service.qiniu.deleteFile('webimg', achievement.dataValues.attachment);
        } catch (err) {
          console.log(err);
        }
        await achievement.update(params);
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
}
module.exports = AchievementIssue;
