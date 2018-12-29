const express = require('express');
const loginModels = require('../wxModels/login/loginModels');
const router = express.Router();

//微信登录
router.post('/login',loginModels.login);

module.exports = router;