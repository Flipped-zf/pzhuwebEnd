'use strict';
const Controller = require('egg').Controller;
const md5 = require('js-md5');
const code = require("svg-captcha");

class Login extends Controller {
  async adminLogin() {
    const { ctx } = this;
    try {
      const { id, password,code } = ctx.request.body;
      if(code.toLowerCase() !== ctx.session.backcode.toLowerCase()) {
        ctx.status = 200;
        ctx.body = {
          success: 0,
          message: '验证码不正确',
        };
        return
      }
      const table = 'User';
      const user = await ctx.service.mysql.findOne(id, table,'Status');
      ctx.status = 200;
      if (!user) {
        ctx.body = {
          success: 0,
          message: '账号不存在'
        };
      } else if ( user.dataValues.status < 2 || user.dataValues.status > 3 ) {
        ctx.body = {
          success: 0,
          message: '非管理员账号,禁止登录'
        };
      } else if ( user.dataValues.active === 0 || user.dataValues.status.active === 0 ) {
        ctx.body = {
          success: 0,
          message: '账号被禁用,禁止登录'
        };
      } else if (md5(user.dataValues.password) !== password) {
        ctx.body = {
          success: 0,
          message: '密码错误'
        };
      } else {
        const token = await ctx.service.jwt.signToken({ id, status: user.dataValues.status });
        ctx.session.adminId = id;
        ctx.body = {
          success: 1,
          data: {
            token,
            id,
            roles: user.dataValues.Status.roles,
            authBtnList: user.dataValues.Status.auth_btn
          }
        };
      }
    } catch (err) {
      ctx.status = 404;
    }
  }
  async adminRender() {
    // this.ctx.body = {
    //   render: Math.random().toString().slice(-4)
    // }
    const { ctx } = this;
    try {
      let mycode = code.createMathExpr({
        mathMin: 1,
        mathMax: 9,
        mathOperator: '+',
        noise: 0,
        bacground: '#cc9966',
        fontSize: 60
      });
      ctx.session.backcode = mycode.text;
      ctx.status = 200
      ctx.set('Content-Type', 'image/svg+xml');
      ctx.body = mycode.data
    }catch(e) {
      ctx.status = 404
      ctx.body = '验证码获取失败'
    }
  }
}

module.exports = Login;
