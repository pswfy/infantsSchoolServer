const systemModel = require('../models/system/systemModel');
/**
 * 系统相关的api
 *
 */
const express = require('express');
const router = express.Router();

//查询nav
router.post('/nav/menu',systemModel.navMenu);

module.exports = router;