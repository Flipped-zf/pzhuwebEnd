'use strict';
const Controller = require('egg').Controller;

class Qiniu extends Controller {
  async getToken() {
    const { ctx } = this;
    const token = ctx.get('Authorization') ||ctx.get('Authorizationfont');
    try {
      const author = await ctx.service.jwt.verifyToken(token);
      if (!author) {
        ctx.status = 403;
      } else {
        const uploadToken = await ctx.service.qiniu.getToken('webimg');
        ctx.status = 200;
        ctx.body = {
          data: uploadToken,
        };
      }
    } catch (err) {
      ctx.status = 500;
      console.log(err);
    }
  }
  async delFile() {
    const { key } = this.ctx.query;
    try {
      await this.ctx.service.qiniu.deleteFile('webimg', key);
      this.ctx.status = 200;
      this.ctx.body = {
        success: 1,
      };
    } catch (error) {
      this.ctx.status = 200;
      this.ctx.body = {
        success: 0,
      };
    }

  }
}
module.exports = Qiniu;
