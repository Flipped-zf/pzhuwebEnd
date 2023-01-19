'use strict';
const Controller = require('egg').Controller;
const md5 = require('js-md5');

class BackUser extends Controller {
  async getadminInfo() {
    const { ctx, app } = this;
    try {
      const id = ctx.session.adminId;
      const table = 'UserInfo';
      const params = {
        include: [
          {
            model: app.model.User,
            attributes: ['name']
          }
        ],
        attributes: ['avatar'],
        where: {
          id
        }
      };
      const admin = await ctx.service.mysql.findAll(params, table);
      ctx.status = 200;
      ctx.body = {
        success: 1,
        data: admin
      };
    } catch (err) {
      console.log(err);
      ctx.status = 500;
    }
  }
  async getUserInfo() {
    const { ctx, app } = this;
    const { Op } = app.Sequelize;
    try {
      const table = 'UserInfo';

      const params2 = {
        include: [
          {
            model: app.model.User,
            attributes: ['name','email'],
            where: {
              status: {
                [Op.eq]: 1
              }
            }
          },
          {
            model: app.model.Domain,
            attributes: ['id','name']
          },
          {
            model: app.model.Major,
            attributes: ['id','name']
          },
          {
            model: app.model.School,
            attributes: ['id','name']
          }
        ],
        attributes: ['id', 'avatar', 'phone','description', 'created_at'],
      };
      // 获取全部的成员信息
      const allUser = await ctx.service.mysql.findAll(params2, table);

      // 根据年级分组
      const gradeGroup = await ctx.service.backUser.gradeGroup(allUser);
      ctx.status = 200;
      ctx.body = {
        success: 1,
        data: {
          allUser,
          gradeGroup,
        }
      };

    } catch (err) {
      console.log(err);
      ctx.status = 404;
    }
  }
  async updateUserInfo() {
    const { ctx } = this;
    try {
      const { id, name, email, schoolMajor, domain, avatar, phone, description, isCDN } = ctx.request.body;
      const table = 'User';
      const isUser = await ctx.service.mysql.findByPk(id, table);
      if (isUser === null) {
        ctx.status = 200;
        ctx.body = {
          success: 0,
          message: '账号不存在',
        };
      } else {
        // 判定是CDN链接还是key值
        let cdn;
        if (parseInt(isCDN) === 1) {
          cdn = await ctx.service.qiniu.getCDN(avatar); // 获去cdn链接
        } else {
          cdn = avatar;
        }
        const table1 = 'UserInfo';
        const params = {
          name,
          email
        };
        const params1 = {
          school: schoolMajor[0],
          major: schoolMajor[1],
          domain,
          avatar: cdn,
          phone,
          description
        };
        const isUserInfo = await ctx.service.mysql.findByPk(id, table1);
        const url = isUserInfo.dataValues.avatar;
        const arr = url.split('/');
        const key = arr[3];
        try {
          if (key !== 'avatar' && url !== cdn) {
            await ctx.service.qiniu.deleteFile('webimg', key);
          }
        } catch (err) {
          console.log(err);
        }
        const user = await ctx.service.mysql.findByPk(id, table);
        await user.update(params);
        const userinfo = await ctx.service.mysql.findByPk(id, table1);
        await userinfo.update(params1);
        ctx.status = 200;
        ctx.body = {
          success: 1,
          message: '用户信息更新成功',
        };
      }
      
    } catch (err) {
      console.log(err);
      ctx.status = 404;
    }
  }
  async initUserMajor() {
    const { ctx, app } = this;
    try {
      const table = 'School';
      const table1 = 'Domain';
      const params = {
        include: {
          model: app.model.Major,
        },
      };
      const schoolmajor = await ctx.service.mysql.findAll(params, table);
      const reslut = await ctx.service.fun.getSchool(schoolmajor);
      let domain = await ctx.service.mysql.findAll({}, table1);
      domain = domain.map(item => {
        return {
          value: item.dataValues.id,
          label: item.dataValues.name,
        };
      });
      ctx.status = 200;
      ctx.body = {
        success: 1,
        data: {
          schoolmajor: reslut,
          domain,
        },
      };
    } catch (err) {
      console.log(err);
      ctx.status = 404;
    }
  }
  async deleteUser() {
    const { ctx } = this;
    try {
      const { id } = ctx.request.body;
      const table = 'User';
      const user = await ctx.service.mysql.findByPk(id, table);
      await user.update({ status: -1 });
      ctx.status = 200;
      ctx.body = {
        success: 1
      };
    } catch (err) {
      console.log(err);
      ctx.status = 404;
    }
  }
  async addUserInfo() {
    const { ctx } = this;
    try {
      const { id, password, name, email, schoolMajor, domain, avatar, phone, description, isCDN } = ctx.request.body;
      const table = 'User';
      const isUser = await ctx.service.mysql.findByPk(id, table);
      if (isUser !== null) {
        ctx.status = 200;
        ctx.body = {
          success: 0,
          message: '账号已存在',
        };
      } else {
        // 判定是CDN链接还是key值
        let cdn;
        if (parseInt(isCDN) === 1) {
          cdn = await ctx.service.qiniu.getCDN(avatar); // 获去cdn链接
        } else {
          cdn = avatar;
        }
        const table1 = 'UserInfo';
        const params = {
          id,
          name,
          password,
          email,
          status: 1
        };
        const params1 = {
          id,
          school: schoolMajor[0],
          major: schoolMajor[1],
          domain,
          avatar: cdn,
          phone,
          description
        };
        // 添加用户信息
        await ctx.service.mysql.create(params, table);
        await ctx.service.mysql.create(params1, table1);
        ctx.status = 200;
        ctx.body = {
          success: 1,
          message: '用户信息添加成功',
        };
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
    try {
      const user = await ctx.service.mysql.findByPk(id, 'User');

      user.update({ password: md5(id + 'web') });

      ctx.status = 200;
      ctx.body = {
        success: 1,
        message: '重置成功'
      };
    } catch (error) {
      ctx.status = error.status || 500;
    }
  }
  //checkuser
  async getCheckUser() {
    const { ctx, app } = this;
    try {
      const table1 = 'User';
      const params1 = {
        where: {
          status: 0
        },
        attributes: ['id', 'name', 'email', 'created_at'],
        order: [['created_at', 'DESC']],
      };
      // 获取审核中成员信息
      const reviewUser = await ctx.service.mysql.findAll(params1, table1);
      ctx.status = 200;
      ctx.body = {
        success: 1,
        data: {
          reviewUser
        }
      };
    } catch (error) {
      console.log(err);
      ctx.status = 404;
    }
  }
  async userReviewPass() {
    const { ctx,app } = this;
    const { Op } = app.Sequelize;
    try {
      const { ids } = ctx.request.body;
      await ctx.model.User.update({ status: 1 },{
        where: {
          id: {
            [Op.in]: ids
          }
        },
      });
      ctx.status = 200;
      ctx.body = { 
        success: 1,
        message: '操作成功'
      };
    } catch (err) {
      console.log(err);
      ctx.status = 404;
    }
  }
  async userRefuseJoin() {
    const { ctx,app } = this;
    const { Op } = app.Sequelize;

    try {
      const { ids } = ctx.request.body;
      await ctx.model.User.destroy({
        where: {
          id: {
            [Op.in]: ids
          }
        },
      });
      ctx.status = 200;
      ctx.body = {
        success: 1,
        message: '操作成功'
      };
    } catch (err) {
      console.log(err);
      ctx.status = 404;
    }
  }
}
module.exports = BackUser;
