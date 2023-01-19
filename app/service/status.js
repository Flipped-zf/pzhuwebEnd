'use strict';

const Service = require('egg').Service;
// const { Op } = require("sequelize");

class Status extends Service {
  async list({ offset = 0, limit = 1}) {
    const { Op } = this.app.Sequelize;
    return this.ctx.model.Status.findAndCountAll({
      where:{
        id: {
          [Op.gt]: [0]
        }
      } ,
      order: [ [ 'id', 'ASC' ]],
      // attributes: [ 'id','roles', 'auth_btn','active', 'created_at', 'updated_at' ],
      // include: [
      //   {  model: this.ctx.model.User ,attributes:  [ 'id', 'name','status' ]}
      // ]
    });
  }

  async find(id) {
    const Status = await this.ctx.model.Status.findByPk(id);
    if (!Status) {
      this.ctx.throw(404, 'Status not found');
    }
    return Status;
  }

  async create(Status) {
    // console.log(Status[0]);
    return this.ctx.model.Status.create(Status);
  }

  async update({ id, updates }) {
    const Status = await this.ctx.model.Status.findByPk(id);
    if (!Status) {
      this.ctx.throw(404, 'Status not found');
    }
    return Status.update(updates);
  }

  async del(id) {
    const Status = await this.ctx.model.Status.findByPk(id);
    if (!Status) {
      this.ctx.throw(404, 'Status not found');
    }
    return Status.destroy();
  }
}

module.exports = Status;
