'use strict';

module.exports = app => {
  const { router, controller } = app;
  router.get('/myapi', controller.test.home.index);
  router.get('/myapi/test', controller.test.home.test);
  router.get('/', controller.other.index);
  //all common 权限
  router.get('/qiniuToken',controller.qiniu.getToken)
  // 前/fontapi, 后/backapi 权限
  //后台接口
  router.post('/backlogin', controller.backLogin.adminLogin);
  router.get('/backRender', controller.backLogin.adminRender);
  router.get('/backapi/users', controller.backUser.getUserInfo);
  router.get('/backapi/initUserMajor', controller.backUser.initUserMajor);
  router.post('/backapi/updateUserInfo', controller.backUser.updateUserInfo);
  router.post('/backapi/deleteUser', controller.backUser.deleteUser);
  router.post('/backapi/addUserInfo', controller.backUser.addUserInfo);
  router.get('/backapi/resetPassword/:id', controller.backUser.resetPassword);
  router.get('/backapi/getCheckUser',controller.backUser.getCheckUser);
  router.post('/backapi/userReviewPass',controller.backUser.userReviewPass);
  router.post('/backapi/userRefuseJoin',controller.backUser.userRefuseJoin);

  app.resources('status', '/backapi/status', app.controller.status);

  router.get('/backapi/delfile',controller.qiniu.delFile);

  router.get('/backapi/getedithome',controller.backedithome.getedithome)
  router.post('/backapi/updateHomeInfo',controller.backedithome.updateHomeInfo)
  //文章管理
  router.post('/backapi/getArticleInfo', controller.backArticle.getArticleInfo)
  router.post('/backapi/deleteArticle', controller.backArticle.deleteArticle)
  router.post('/backapi/istop',controller.backArticle.istop)
  router.post('/backapi/delArticleTag', controller.backArticle.delArticleTag)
  router.post('/backapi/addArticleTag', controller.backArticle.addArticleTag)
  router.post('/backapi/getArticleEdit', controller.backArticle.getArticleEdit)
  router.post('/backapi/uploadArticleInfo', controller.backArticle.uploadArticleInfo)
  router.post('/backapi/uploadArticleeCover', controller.backArticle.uploadArticleeCover)
  router.post('/backapi/delCoverImg', controller.backArticle.delCoverImg)
  //成果管理
  router.post('/backapi/getAchievementInfo', controller.backachievement.getAchievementInfo)
  router.post('/backapi/delAchievement', controller.backachievement.delAchievement)
  router.post('/backapi/addAchievementTag', controller.backachievement.addAchievementTag)
  router.post('/backapi/delAchievementTag', controller.backachievement.delAchievementTag)
  router.post('/backapi/isShow', controller.backachievement.isShow)
  //资源管理
  router.post('/backapi/getResourceInfo', controller.backresource.getResourceInfo)
  router.post('/backapi/delResource', controller.backresource.delResource) 
  router.post('/backapi/addResourceTag', controller.backresource.addResourceTag)
  router.post('/backapi/delResourceTag', controller.backresource.delResourceTag)
  //相册管理
  router.post('/backapi/getAlbums/',controller.backalbum.getAlbums)
  router.get('/backapi/delAlbum',controller.backalbum.delAlbum)
  router.get('/backapi/getPhotosByAlbumId/:id',controller.backalbum.getPhotosByAlbumId)
  router.get('/backapi/addAlbumType/:name',controller.backalbum.addAlbumType)
  router.get('/backapi/delAlbumType/:id',controller.backalbum.delAlbumType)
  router.post('/backapi/createAlbum', controller.backalbum.createAlbum)
  router.post('/backapi/updateAlbum', controller.backalbum.updateAlbum)
  router.post('/backapi/uploadPhotos', controller.backalbum.uploadPhotos)
  router.post('/backapi/delPhotos', controller.backalbum.delPhotos)
  router.post('/backapi/movePhotos', controller.backalbum.movePhotos)
  ///fontapi
  router.get('/fontapi/getInitInfo', controller.person.getInitInfo);
  router.get('/fontapi/getInitMessage',controller.person.getInitMessage)
  router.post('/fontapi/uploadUserInfo',controller.person.uploadUserInfo)

  router.post('/fontapi/getAchievementIssue',controller.achievementIssue.getAchievementIssue)//成果
  router.post('/fontapi/uploadAchievement',controller.achievementIssue.uploadAchievement)
  router.get('/fontapi/deleteAchievement/:id',controller.userpage.delUserAchievement)
  router.post('/fontapi/uploadAchievementCover',controller.achievementIssue.uploadAchievementCover)
  router.post('/fontapi/delAchievementCover',controller.achievementIssue.delAchievementCover)
  router.post('/fontapi/uploadAchievementAttachment',controller.achievementIssue.uploadAchievementAttachment)
  router.post('/fontapi/delAchievementAttachment',controller.achievementIssue.delAchievementAttachment)

  router.post('/fontapi/getResourceIssue',controller.resourceIssue.getResourceIssue)
  router.post('/fontapi/uploadResource',controller.resourceIssue.uploadResource)
  router.get('/fontapi/deleteResource/:id',controller.userpage.delUserResource)
  router.post('/fontapi/uploadResourceCover',controller.resourceIssue.uploadResourceCover)
  router.post('/fontapi/delResourceCover',controller.resourceIssue.delResourceCover)
  router.post('/fontapi/uploadResourceAttachment',controller.resourceIssue.uploadResourceAttachment)
  router.post('/fontapi/delResourceAttachment',controller.resourceIssue.delResourceAttachment)

  router.post('/fontapi/getArticleEdit',controller.articleEdit.getArticleEdit)
  router.post('/fontapi/uploadArticleInfo',controller.articleEdit.uploadArticleInfo)
  router.post('/fontapi/uploadArticleeCover',controller.articleEdit.uploadArticleeCover)
  router.post('/fontapi/delCoverImg',controller.articleEdit.delCoverImg)
  router.get('/fontapi/delUserArticle/:id',controller.userpage.delUserArticle)
  router.post('/fontapi/uploadArticleResource',controller.articleEdit.uploadArticleResource)
  router.get('/fontapi/getMediaItems',controller.articleEdit.getMediaItems)
  //无权限  
  router.get('/homeinfo', controller.home.getHomeInfo); 
  router.get('/homeuserinfo', controller.home.getHomeuser);
  router.get('/article/:beg/:end/:index/:keywords',controller.article.getArticle);
  router.get('/articleDetails/:id',controller.articleInfo.getArticleInfo);
  router.get('/resourceShare',controller.resource.getResource)
  router.get('/achievementShare',controller.achievement.getAchievement)
  router.get('/memberInfo',controller.member.getMemberInfo)
  router.get('/albums/:type',controller.album.getAlbums)
  router.get('/photosByAlbumId/:id',controller.album.getPhotosByAlbumId)
  router.get('/getcode',controller.login.getCode)
  router.post('/fontlogin',controller.login.login)
  router.post('/forgetpassword',controller.login.forgetPassword)
  router.post('/changepassword',controller.login.changePassword)
  router.get('/getemailCode',controller.login.getemailCode)
  router.get('/registerUser',controller.register.registerUser)
  router.get('/emailCode',controller.register.uploadCode)
  //有ctx.query.id为游客
  router.get('/getUserInfo',controller.userpage.getUserInfo); 
  router.get('/getUserArticle',controller.userpage.getUserArticle)
  router.get('/searchUserArticle',controller.userpage.searchUserArticle)
  router.get('/getUserAchievement',controller.userpage.getUserAchievement)
  router.get('/searchUserAchievement',controller.userpage.searchUserAchievement)
  router.get('/getUserCollect',controller.userpage.getUserCollect)
  router.get('/searchUserCollect',controller.userpage.searchUserCollect)
  router.get('/getUserResource',controller.userpage.getUserResource)
  router.get('/searchUserResource',controller.userpage.searchUserResource)
};

