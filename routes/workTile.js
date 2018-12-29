const worktileModel =require('../models/worktile/worktileModel');
/**
 * work-tile的api
 *
 */
const express = require('express');
const router = express.Router();

//workTile
router.post('/work/tile',worktileModel.workTitle);

module.exports = router;