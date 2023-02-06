'use strict';

const Controller = require('egg').Controller;
const code = require("svg-captcha");
const md5 = require('js-md5');

class Login extends Controller {
  async getCode(){
    const { ctx } = this;
    try {
      let mycode = code.create({
        size: 4,
        ignoreChars: "0o1iIl",
        noise: 2,
        bacground: '#cc9966',
        fontSize: 60
      });
      ctx.session.code = mycode.text;
      ctx.status = 200
      ctx.set('Content-Type', 'image/svg+xml');
      ctx.body = mycode.data
    }catch(e) {
      ctx.status = 404
      ctx.body = '验证码获取失败'
    }
  }
  async login() {
    const { ctx } = this;
    const { id, password,code } = ctx.request.body;
    const table = 'User';
    if(code.toLowerCase() !== ctx.session.code.toLowerCase()) {
      ctx.status = 200;
      ctx.body = {
        success: 0,
        message: '验证码不正确',
      };
      return
    }
    try {
      const isExist = await ctx.service.mysql.findByPk(id, table);
      if (isExist == null) {
        ctx.status = 200;
        ctx.body = {
          success: 0,
          message: '账号不存在',
        };
      } else if (md5(isExist.dataValues.password) !== password) {
        ctx.status = 200;
        ctx.body = {
          success: 0,
          message: '密码错误',
        };
      } else if (isExist.dataValues.status === 0) {
        ctx.status = 200;
        ctx.body = {
          success: 0,
          message: '账号正在审核中，请联系管理员。',
        };
      } else if (isExist.dataValues.active === 0) {
        ctx.status = 200;
        ctx.body = {
          success: 0,
          message: '账号已被禁用，请联系管理员。',
        };
      }else {
        ctx.status = 200;
        const token = await ctx.service.jwt.signToken({ id, status: isExist.dataValues.status });
        ctx.session.userid = isExist.id;
        ctx.body = {
          success: 1,
          message: '登陆成功',
          data: {
            token,
            id: isExist.id,
            name: isExist.dataValues.name,
          },
        };
      }
    } catch (err) {
      ctx.status = 404;
      console.log(err);
      ctx.body = {
        message: '登录失败',
      };
    }
  }
  async loginToken() {
    const time = Date.now();
    this.ctx.session.time = time;
    this.ctx.body = {
      success: 1,
      message: time,
    };
  }
  // 忘记密码
  async forgetPassword() {
    const { ctx } = this;
    const { id, password, email } = ctx.request.body;
    try {
      const table = 'User';
      const params = {
        where: {
          id: id,
          email: email,
        },
      };
      const isUser = await ctx.service.mysql.findAll(params, table);
      if (isUser.length !== 0) {
        ctx.session.id = id;
        ctx.session.password = password;
        ctx.session.email = email;
        ctx.status = 200;
        ctx.body = {
          success: 1,
        };
      } else {
        ctx.status = 200;
        ctx.body = {
          success: 0,
          message: '用户信息有误',
        };
      }
    } catch (err) {
      // console.log(err)
      ctx.status = 404;
    }
  }
  async getemailCode() {
    const { ctx } = this;
    let code = '';
    const email = ctx.session.email;
    for (let i = 0; i < 6; i++) {
      code += Math.floor(Math.random() * 10);
    }
    const content = {
      subject: '邮箱验证码',
      text: `您好,您在WEB应用专业团队官网的修改密码验证码是:${code},如非本人操作，请忽略本邮件`,
    };
    try {
      ctx.session.emailcode = code;
      ctx.status = 200;
      ctx.body = {
        success: 1,
        message: '邮件发送成功，请注意查收！',
      };
      ctx.service.nodemailer.sendEmail(email, content);
    } catch (error) {
      ctx.status = 404;
      ctx.body = {
        message: '无效的邮箱地址',
      };
    }
  }
  // 修改密码
  async changePassword() {
    const { ctx } = this;
    try {
      const { code } = ctx.request.body;
      if (ctx.session.emailcode !== code) {
        ctx.status = 200;
        ctx.body = {
          success: 0,
          message: '验证码有误',
        };
      } else {
        const id = ctx.session.id;
        const table = 'User';
        const isUser = await ctx.service.mysql.findByPk(id, table);
        await isUser.update({
          password: ctx.session.password,
        });
        // await ctx.service.nodemailer.sendEmail(isUser.email, content);
        ctx.status = 200;
        ctx.body = {
          success: 1,
          message: '修改成功！',
        };
        // ctx.status = 200;
        // ctx.body = {
        //   success: 1,
        //   data: {
        //     password: ctx.session.password,
        //   },
        // };
      }
    } catch (err) {
      ctx.status = 404;
      console.log(err);
    }
  }
  // 重置密码
  async resetPassword() {
    const { ctx } = this;
    const { id } = ctx.params;
    const auth = ctx.session.auth;
    try {
      if (auth !== 3) {
        throw { status: 401 };
      }
      const user = await ctx.service.mysql.findById(id, 'User');
      user.update({ password: md5('123456') });

      ctx.status = 200;
      ctx.body = {
        success: 1,
        message: '重置成功'
      };

    } catch (error) {
      ctx.status = error.status || 500;
    }


  }
  async logout() {
    const {ctx} = this;
    ctx.session.userid = 0;
    ctx.status = 200;
    ctx.body = {
      success: 1,
      message: '成功退出'
    };
  }
}
module.exports = Login;
