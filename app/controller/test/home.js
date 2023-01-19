'use strict';
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const {ctx} = this;
    // ctx.cookies.set('hello','Lucy');
    const user = await ctx.service.mysql.findOne('admin', 'User','Status');

    ctx.session.test = 'test';
    ctx.body = {
      data: user,
    };
  }
  async test() {
    const {ctx} = this;
    console.log(ctx.session.test)
    ctx.body = {
      data: ctx.session.test,
    };
  }
}

module.exports = HomeController;
