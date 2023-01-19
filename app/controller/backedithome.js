'use strict';
const Controller = require('egg').Controller;

class edithome extends Controller {
  async getedithome() {
    const { ctx } = this;
    try{
      const baseInfo = await ctx.service.mysql.findAll({
        attributes: ['id','title','cover','desc','order'],
      }, 'Home');
      ctx.status = 200;
      ctx.body = {
        success: 1,
        baseInfo,
      }
    }catch(e){
      ctx.status = 404;
    }
  }
  async updateHomeInfo() {
    const { ctx } = this;
//     http://img.pzhuweb.cn/1664507883343banner.jpg
// http://img.pzhuweb.cn/00022501561799857381.jpg
// http://img.pzhuweb.cn/admin1621223304808_MG_5221.jpg
    const { id, title, desc, cover,num } = ctx.request.body;
    try {
      if(num == 3) {
        for(let i = 0; i <3; i++) {
          const home = await ctx.service.mysql.findByPk(i+1, 'Home');
          if (!home) throw new Error();
          if(i == 0) {
            home.update({ title, desc, cover:cover[i] });
          } else {
            home.update({ cover:cover[i] });
          }
        }
      } else {
        const home = await ctx.service.mysql.findByPk(id, 'Home');
        if (!home) throw new Error();
        home.update({ title, desc, cover:cover[0] });
      }
      ctx.status = 200;
      ctx.body = {
        success: 1,
        message: '修改成功'
      };
    } catch (error) {
      ctx.status = 500;
    }
  }
}
module.exports = edithome;
