'use strict';

const Controller = require('egg').Controller;

class statusController extends Controller {
  async index() {
    const ctx = this.ctx;
    const query = {
      offset: ctx.helper.parseInt(ctx.query.offset),
      limit: ctx.helper.parseInt(ctx.query.limit)
    };
    ctx.body = await ctx.service.status.list(query);
  }

  async show() {
    const ctx = this.ctx;
    ctx.body = await ctx.service.status.find(ctx.helper.parseInt(ctx.params.id));
  }

  async create() {
    const ctx = this.ctx;
    const status = await ctx.service.status.create(ctx.request.body);
    ctx.status = 201;
    ctx.body = status;
  }

  async update() {
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.params.id);
    const body = ctx.request.body;
    const status = await ctx.service.status.update({ id, updates: body });
    ctx.body = {
      success: 1,
      message: '修改成功!!!'
    };
  }

  async destroy() {
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.params.id);
    await ctx.service.status.del(id);
    ctx.status = 200;
  }
}

module.exports = statusController;
