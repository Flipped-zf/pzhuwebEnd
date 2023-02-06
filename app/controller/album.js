'use strict';

const Controller = require('egg').Controller;

class AlbumController extends Controller {
  async getAlbums() {
    const { ctx, app } = this;
    const { Op } = app.Sequelize;
    const { type } = ctx.params;
    const albumTable = 'Album';
    const params = {
      include: [
        {
          model: app.model.AlbumType,
          attributes: ['name']
        },
        {
          model: app.model.Photo,
          attributes: ['link'],
        }
      ],
      where: {
        status: 1,
        type: parseInt(type)
      }
    };
    try {
      const albums = await ctx.service.mysql.findAll(params, albumTable);
      let albumTypes = await ctx.service.mysql.findAll({ where: { status: 1,id:{[Op.ne]: 0 } }}, 'AlbumType');
      albumTypes = albumTypes.map(albumType => {
        return { 
          label: albumType.name, 
          value: albumType.id
        }
      })
      const photos = await ctx.service.mysql.findAll({ where: { status: 1 } }, 'Photo');
      const photoNum = photos.reduce((result, photo) => {
        if (!result[photo.album_id]) {
          result[photo.album_id] = 0;
        }
        result[photo.album_id]++;
        return result;
      }, {});
      if (albums.length > 0) {
        ctx.status = 200;
        ctx.body = {
          data: {
            albums,
            photoNum,
            albumTypes
          }
        };
      } else {
        ctx.status = 200;
        ctx.body = {
          success: 1,
          message: '暂无无相册'
        };
      }
    } catch (error) {
      console.log(error);
      ctx.status = 500;
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
        status: { [Op.ne]: 0 },
      }
    };
    try {
      const albumInfo = await ctx.service.mysql.findAll(params, 'Album');
      if (albumInfo[0].dataValues.status === 2 && !ctx.session.userid) {
        throw { status: 403 };
      }
      const photos = await ctx.service.mysql.findAll({ where: { status: 1, album_id: id } }, 'Photo');
      ctx.status = 200;
      ctx.body = {
        success: 1,
        data: {
          photos,
          albumInfo: {
            ...albumInfo[0].dataValues,
            cover: albumInfo[0].dataValues.Photo.link
          },
        }
      };
    } catch (error) {
      ctx.status = error.status || 500;
      console.log(error);
    }
  }
}

module.exports = AlbumController;
