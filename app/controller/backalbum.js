'use strict';

const Controller = require('egg').Controller;

class Album extends Controller {
  async getAlbums() {
    // 0 删除 1 正常 2 默认(后台可见)
    const { ctx, app } = this;
    const { Op } = app.Sequelize;
    let { page, pageSize,keywords,mytag } = ctx.request.body;
    const albumTable = 'Album';
    const albumTypeTable = 'AlbumType';
    const params = { 
      include: [
        {
          model: app.model.AlbumType,
          attributes: ['id','name']
        }
      ],
      where: {
        status: {
          [Op.gt]: [0]
        },
        name: {
          [Op.like]: '%' +keywords+'%',
        },
        type: {
          [mytag ? Op.in:Op.notIn]: [mytag]
        }
      },
      attributes: ['id','user_id', 'type', 'name','status', 'description', 'created_at'],
      order: [['created_at', 'DESC']],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    };
    const params1 = {
      where: {
        status: 1,
        name: {
          [Op.like]: '%' +keywords+'%',
        },
        type: {
          [mytag ? Op.in:Op.notIn]: [mytag]
        }
      }
    };
    try {
      const albums = await ctx.service.mysql.findAll(params, albumTable);
      const allalbum = await ctx.service.mysql.findAll(params1, albumTable);
      const total = allalbum.length;
      const albumTypes = await ctx.service.mysql.findAll({ where: { status: 1 } }, albumTypeTable);
      const photos = await ctx.service.mysql.findAll({ where: { status: 1 } }, 'Photo');
      const photoNum = photos.reduce((result, photo) => {
        if (!result[photo.album_id]) {
          result[photo.album_id] = 0;
        }
        result[photo.album_id]++;
        return result;
      }, {});
      ctx.status = 200;
      ctx.body = {
        data: {
          albums,
          photoNum,
          albumTypes,
          total
        }
      };
    } catch (error) {
      console.log(error);
      ctx.status = 500;
    }
  }
  async delAlbum() {
    const { ctx } = this;
    const id = Number(ctx.query.id);
    let transaction = null;
    try {
      transaction = await ctx.model.transaction();
      if (id === 0) {
        throw {
          status: 200, body: {
            success: 0,
            message: '无法删除回收站相册'
          }
        };
      }
      const belongPhotos = await ctx.service.mysql.findAll({ where: { status: 1, album_id: id } }, 'Photo');
      await belongPhotos.forEach(async photo => await photo.update({ album_id: 0 }));
      const album = await ctx.service.mysql.findByPk(id, 'Album');
      album.update({ status: 0 });
      await transaction.commit();
      ctx.status = 200;
      ctx.body = {
        success: 1,
        message: '删除成功'
      };
    } catch (error) {
      await transaction.rollback();
      ctx.status = 200;
      ctx.body = error.body || {
        success: 0,
        message: '删除失败'
      };
    }
  }
  async createAlbum() {
    const { ctx } = this;
    const { name, desc, typeId, status } = ctx.request.body;
    const userId = ctx.session.adminId;
    const albumTable = 'Album';
    try {
      const isExist = await ctx.service.mysql.findAll({ where: { status: 1, name, type: typeId } }, albumTable);
      if (isExist.length) {
        ctx.status = 200;
        ctx.body = {
          success: 0,
          message: '相册名重复'
        };
        return;
      }
      await ctx.service.mysql.create({ user_id: userId, name, description:desc, type: typeId, status: Boolean(status) + 1 }, albumTable);
      ctx.status = 200;
      ctx.body = {
        success: 1,
        message: '添加成功'
      };
    } catch (error) {
      ctx.status = 500;
      console.log(error);
    }
  }
  async updateAlbum() {
    const { ctx } = this;
    const { userid } = ctx.session;
    const { id, typeId, name, desc, status } = ctx.request.body;
    try {
      const album = await ctx.service.mysql.findByPk(id, 'Album');
      await album.update({ user_id: userid,type: typeId, name, description:desc, status: Boolean(status) + 1 });
      ctx.status = 200;
      ctx.body = {
        success: 1,
        message: '修改成功'
      };
    } catch (error) {
      ctx.status = 200;
      ctx.body = {
        success: 0,
        message: '修改失败'
      };
    }
  }
  async getPhotosByAlbumId() {
    const { ctx, app } = this;
    const { id } = ctx.params;
    const { Op } = app.Sequelize;
    const params = {
      include: [
        {
          model: app.model.Photo,
          attributes: ['link'],
        }
      ],
      where: {
        id,
        status: { [Op.gt]: 0 },
      },
      attributes: ['cover','name','description']
    };
    try {
      const albumInfo = await ctx.service.mysql.findAll(params, 'Album');
      let albums = await ctx.service.mysql.findAll({ where: { status: 1 } }, 'Album');
      albums = albums.map(item => {
        return {
          label: item.name,
          value: item.id
        }
      }).filter(item => item.value != id)
      if (albumInfo[0].dataValues.status === 2 && !ctx.session.adminId) {
        throw { status: 403 };
      }
      const photos = await ctx.service.mysql.findAll({ where: { status: 1, album_id: id },attributes: ['link','name','id'] }, 'Photo');
      ctx.status = 200;
      ctx.body = {
        success: 1,
        data: {
          photos,
          albumInfo: {
            ...albumInfo[0].dataValues,
            cover: albumInfo[0].dataValues.Photo.link
          },
          albums
        }
      };
    } catch (error) {
      ctx.status = error.status || 500;
      console.log(error);
    }
  }
  async addAlbumType() {
    const { ctx } = this;
    const { name } = ctx.params;
    try {
      const table = 'AlbumType';
      const params = {
        where: {
          name
        }
      };
      const isTag = await ctx.service.mysql.findAll(params, table);
      if (isTag.length !== 0) {
        // 标签已存在
        if (isTag[0].dataValues.status === 1) {
          ctx.status = 200;
          ctx.body = {
            success: 0,
            message: '标签已存在'
          };
          // 标签恢复
        } else if (isTag[0].dataValues.status === 0) {
          await isTag[0].update({ status: 1 });
          ctx.status = 200;
          ctx.body = {
            success: 1,
            tag: isTag[0],
            message: '标签已恢复'
          };
        }
      } else {
        const tag = await ctx.service.mysql.create({ name }, table);
        ctx.status = 200;
        ctx.body = {
          success: 1,
          tag: tag,
          message: '标签添加成功'
        };
      } 
    } catch (error) {
      ctx.status = 404;
    }
  }
  async delAlbumType() {
    const { ctx } = this;
    const id = Number(ctx.params.id);
    let transaction = null;
    try {
      transaction = await ctx.model.transaction();
      if (id === 1) {
        throw {
          status: 200, body: {
            success: 0,
            message: '无法删除默认分类'
          }
        };
      }
      const belongAlbums = await ctx.service.mysql.findAll({ where: { status: 1, type: id } }, 'Album');
      await belongAlbums.forEach(async album => await album.update({ type: 1 }));
      const type = await ctx.service.mysql.findByPk(id, 'AlbumType');
      type.update({ status: 0 });
      await transaction.commit();
      ctx.status = 200;
      ctx.body = {
        success: 1,
        message: '删除成功'
      };
    } catch (error) {
      await transaction.rollback();
      ctx.status = error.status || 500;
      ctx.body = error.body;
    }
  }

  async uploadPhotos() {
    const { ctx } = this;
    const { albumId, link,name } = ctx.request.body;
    const user_id = ctx.session.adminId;
    try {
      const photo = await ctx.service.mysql.create({ user_id, album_id: albumId, link, name }, 'Photo');
      ctx.status = 200;
      ctx.body = {
        success: 1,
        data: {
          id: photo.id,
          link
        },
        message: '上传成功'
      };
    } catch (error) {
      ctx.status = 500;
      console.log(error);
    }
  }
  async delPhotos() {
    const { ctx, app } = this;
    const { ids, albumId } = ctx.request.body;
    const { Op } = app.Sequelize;
    let transaction = null;
    try {
      transaction = await ctx.model.transaction();
      const photos = await ctx.service.mysql.findAll({ where: { id: {[Op.in]: ids } }}, 'Photo');
      if(Number(albumId)) {
      } else {
        await photos.forEach(async photo => await ctx.service.qiniu.deleteFile('webimg', photo.link));
        await app.model.Photo.destroy({
          where: {
            id: {
              [Op.in]: ids 
            }
          }
        })
      }
      ctx.status = 200;
      ctx.body = {
        success: 1,
        message: '删除成功'
      };
      await transaction.commit();
    } catch (error) { 
      await transaction.rollback();
      ctx.status = error.status || 500;
      ctx.body = error.body;
    }
  }
  async movePhotos() {
    const { ctx, app } = this;
    let { ids, albumId } = ctx.request.body;
    const { Op } = app.Sequelize;

    let transaction = null;
    try {
      ids = ids.map(id => {
        if (isNaN(Number(id))) {
          throw { status: 200, body: { success: 0, message: '恶意请求' } };
        }
        return Number(id);
      });
      transaction = await ctx.model.transaction();
      const album = await ctx.service.mysql.findByPk(albumId, 'Album');
      if (album.length === 0) throw { status: 200, body: { success: 0, message: '指定相册不存在' } };
      const photos = await ctx.service.mysql.findAll({ where: { id: { [Op.in]: ids } } }, 'Photo');
      await photos.forEach(async photo => await photo.update({ album_id: albumId }));
      ctx.status = 200;
      ctx.body = {
        success: 1,
        message: '转移成功'
      };
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      ctx.status = error.status || 500;
      ctx.body = error.body;
    }
  }
}
module.exports = Album