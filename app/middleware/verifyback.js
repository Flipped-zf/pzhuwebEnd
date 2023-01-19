'use strict';
const jwt = require('jsonwebtoken');

module.exports = () => {
  return async function verify(ctx, next) {
    const token = ctx.header.authorization;
    if(ctx.service.jwt.verifyToken(token)) {
      await next();
    }else {
      ctx.status = 403;
      ctx.body = {
        message: '亲登录'
      } 
    }
  };
};
