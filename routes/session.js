/**
 * session的api
 *
 */
const express = require('express');
const code = require('../common/code');
const school = require('../models/school/schoolSchema');
const router = express.Router();

//session
router.post('/user/info', (req, res, next) => {
  //判断是否登录
  if (req.session.loginSuccess) {
    //学校id
    let school_id = null;
    //学校名称
    let school_name = null;
    //判断是否在session中有学校code
    if (req.session.code) {
      //根据学校code查询学校id
      school.findOneSchoolCode(req.session.code, (err, result) => {
        //发错错误
        if (err) {
          res.send({'success_code': code.DATA_BASE_ERROR, 'result_data': []});
          return;
        }
        //找不到相应code 的学校
        if (Array.isArray(result) && result.length < 1 || result === null || result === {}) {
          _sessionInfo(req,school_id,school_name,(sessionInfo) => {
            res.send({'success_code': code.USER_LOGIN_SUCCESS, 'result_data': sessionInfo});
          });
          return;
        }
        //有相应的学校id,拿到学校id
        school_id = result._id;
        school_name = result.name;
        _sessionInfo(req,school_id,school_name,(sessionInfo) => {
          res.send({'success_code': code.USER_LOGIN_SUCCESS, 'result_data': sessionInfo});
        });
      });
      //没有学校code
    }else{
      _sessionInfo(req,school_id,school_name,(sessionInfo) => {
        res.send({'success_code': code.USER_LOGIN_SUCCESS, 'result_data': sessionInfo});
      });
    }
    //用户未登录
  } else {
    res.send({'success_code': code.USER_LOGIN_ERROR, 'result_data': []});
  }
});
/**
 * session内部相应对象
 * @param id
 * @param name
 * @param callback
 * @private
 */
_sessionInfo = function(_req,id,name,callback){
  let sessionInfo = {
    '_id': _req.session._id,
    'userName': _req.session.userName,
    'userAvatar': _req.session.userAvatar,
    'jurisdiction': _req.session.jurisdiction,
    'school_id': id,
    'school_name':name
  };
  callback(sessionInfo);
};

module.exports = router;