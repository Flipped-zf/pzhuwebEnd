'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = ' pzhuweb';

  // 加载 errorHandler 中间件
  config.middleware= ['errorHandler','verifyback'],
  // 只对 /api 前缀的 url 路径生效
  config.errorHandler={
    match: ['/myapi','/backapi'],
  };
  config.verifyback = {
    match: '/backapi'
  }
  config.verifyfont = {
    match: '/fontapi'
  }

  // change to your own sequelize configurations
  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'pzhuweb2',
    username: 'root',
    password: 'root',
  };

  config.security= {
    csrf: {
      headerName: 'x-csrf-token', // 通过 header 传递 CSRF token 的默认字段为 x-csrf-token
    },
  },
  // 邮件信息配置
  config.nodemailer = {
    user: 'email@pzhuweb.cn',
    pass: 'PzhuWeb1231',
    from: 'email@pzhuweb.cn',
    replyTo: '497620334@qq.com'
  };

  // 七牛云秘钥
  config.qiniuKey = {
    accessKey: 'RQPDrNQ4aoOWEn_3rMg9xH273n5NuGXizE-JhbOv',
    secretKey: 'MalqHu1GWMf3TXFZM_QrMgIdm76IVETBZ3nmTrEv'
  };
  // token鉴权秘钥
  config.token = 'webJWT';
  config.bodyParser = {
    jsonLimit: '100mb',
    formLimit: '100mb',
  };
  // 配置session
  config.session = {
    key: 'SESSION_ID', // key名字
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    encrypt: true, // 加密
    renew: true, // 最大时间范围内，刷新，自动增加最大时间
    // sameSite: 'none',
    // secure: true,
  };
  // config.cookie = {
  // }
  // config.cors = {
  //   credentials: true
  // }; 


  return config;
};
