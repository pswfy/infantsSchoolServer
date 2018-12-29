const express = require('express');
const userModel = require('../models/user/userModel');
const router = express.Router();

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//用户后台登录检验用户名
router.post('/login/user/name', userModel.loginUSerName);

//用户后台登录校验用户名和密码
router.post('/login', userModel.login);

//创建一个用户
router.post('/create/user',userModel.createUser);

//根据id删除一个用户
router.post('/delete',userModel.deleteUser);

//用户登出
router.post('/exit',userModel.exit);

//修改用户权限
router.post('/diction',userModel.diction);

//修改用户名
router.post('/update/name',userModel.updateUserName);

//修改密码
router.post('/update/password',userModel.updatePassword);

//修改学校code(学校权限)

//修改头像

module.exports = router;
