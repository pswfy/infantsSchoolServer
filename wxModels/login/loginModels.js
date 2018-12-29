const responseCode = require('../../common/responseCode');
const userModel = require('../../models/user/userSchema');
const md5 = require('../../common/md5');
const md6 = require('../../common/md6');
const codeMsg = require('../../common/code');
const wx = require('../../common/wx');
const request = require('request');
/**
 * @param req
 * @param res
 * @param next
 */
exports.login = (req, res, next) => {
  let code = req.body.code;
  let loginStorage = req.body.loginStorage;
  let nickName = req.body.nickName;
  let avatarUrl = req.body.avatarUrl;
  let gender = req.body.gender;
  //叁数检验
  responseCode.parameterError(res, code, loginStorage, nickName, avatarUrl, gender);
  //获取微信登录信息
  if (req.body.code) {
    let options = {
      method: 'post',
      url: wx.HTTPS,
      formData: {
        appid: wx.APPID,
        secret: wx.SECRET,
        js_code: code,
        grant_type: wx.GRANT_TYPE
      }
    };
    //发起网络请求获取openid与全端发来的比较
    request(options, (error, response, body) => {
      if (error) {
        res.json({
          'success_code': codeMsg.ERROR,
          'result_data': []
        })
      } else {
        let _data = JSON.parse(body);
        let _openid = _data.openid;
        let _session_key = _data.session_key;
        if (_openid && _session_key) {
          //MD5不可逆加密
          _openid = md5(md5(_openid) + code.MD5CODE);
          _session_key = md5(md5(_session_key) + code.MD5CODE);
          //查询数据库是否有用户
          userModel.findOneAppId(_openid, (err, result) => {
            //检验数据库错误
            responseCode.errorCode(res, err);
            /*解密*/
            if (loginStorage !== '400') {
              //解密全端数据
              let session_key = md6.Decrypt((loginStorage.session_key).toString(), _openid);
              if (result === null || result === undefined || result === {} || result === '') {
                userModel.create(({
                  'userName': nickName,
                  'password': _session_key,
                  'appId': _openid,
                  'avatar': avatarUrl,
                  'gender': gender
                }), (err, results) => {
                  if (err) {
                    responseCode.response.success_code = codeMsg.DATA_BASE_ERROR;
                    responseCode.response.result_data = null;
                    res.json(response);
                    return;
                  }
                  //session_key未过期
                  if (results.password === session_key) {
                    let msg = {
                      '_id': md6.encryption((results._id).toString(), _openid),
                      'jurisdiction': results.jurisdiction,
                      'session_key': md6.encryption((results.password).toString(), _openid),
                      'code': md6.encryption((results.code).toString(), _openid),
                      'studentId': md6.encryption((results.studentId).toString(), _openid)
                    };
                    res.send({
                      'success_code': codeMsg.SUCCESS,//响应代码200,//成功
                      'result_data': msg//相应数据
                    });
                    //session_key已经过期修改session_key
                  } else {
                    userModel.updateIdByAppIdPassword(_openid, _session_key, (err, resultUpdate) => {
                      //检验数据库错误
                      responseCode.errorCode(res, err);
                      if (parseInt(resultUpdate.n) === 0) {
                        res.send({
                          'success_code': codeMsg.CREATE_UPDATE_ERROR,//响应代码200,//成功
                          'result_data': []//相应数据
                        });
                        return;
                      }
                      let msg = {
                        '_id': md6.encryption((results._id).toString(), _openid),
                        'jurisdiction': results.jurisdiction,
                        'session_key': md6.encryption((_session_key).toString(), _openid),
                        'code': md6.encryption((results.code).toString(), _openid),
                        'studentId': md6.encryption((results.studentId).toString(), _openid)
                      };
                      res.send({
                        'success_code': codeMsg.SUCCESS,//响应代码200,//成功
                        'result_data': msg//相应数据
                      });
                    });
                  }
                });

              } else {
                if (result.password === session_key) {
                  let msg = {
                    '_id': md6.encryption((result._id).toString(), _openid),
                    'jurisdiction': result.jurisdiction,
                    'session_key': md6.encryption((result.password).toString(), _openid),
                    'code': md6.encryption((result.code).toString(), _openid),
                    'studentId': md6.encryption((result.studentId).toString(), _openid)
                  };
                  res.send({
                    'success_code': codeMsg.SUCCESS,//响应代码200,//成功
                    'result_data': msg//相应数据
                  });
                } else {
                  userModel.updateIdByAppIdPassword(_openid, _session_key, (err, resultUpdate) => {
                    //检验数据库错误
                    responseCode.errorCode(res, err);
                    if (parseInt(resultUpdate.n) === 0) {
                      res.send({
                        'success_code': codeMsg.CREATE_UPDATE_ERROR,//响应代码200,//成功
                        'result_data': []//相应数据
                      });
                      return;
                    }
                    let msg = {
                      '_id': md6.encryption((result._id).toString(), _openid),
                      'jurisdiction': result.jurisdiction,
                      'session_key': md6.encryption((_session_key).toString(), _openid),
                      'code': md6.encryption((result.code).toString(), _openid),
                      'studentId': md6.encryption((result.studentId).toString(), _openid)
                    };
                    res.send({
                      'success_code': codeMsg.SUCCESS,//响应代码200,//成功
                      'result_data': msg//相应数据
                    });
                  });
                }
              }
              //400bi表示用户微信小程序为存储用户信息创建用户
            }else {
              if (result === null || result === undefined || result === {} || result === '') {
                userModel.create(({
                  'userName': nickName,
                  'password': _session_key,
                  'appId': _openid,
                  'avatar': avatarUrl,
                  'gender': gender
                }), (err, results) => {
                  if (err) {
                    responseCode.response.success_code = codeMsg.DATA_BASE_ERROR;
                    responseCode.response.result_data = null;
                    res.json(response);
                    return;
                  }
                  //如果session_key有
                  if (results.password === _session_key) {
                    let msg = {
                      '_id': md6.encryption((results._id).toString(), _openid),
                      'jurisdiction': results.jurisdiction,
                      'session_key': md6.encryption((results.password).toString(), _openid),
                      'code': md6.encryption((results.code).toString(), _openid),
                      'studentId': md6.encryption((results.studentId).toString(), _openid)
                    };
                    res.send({
                      'success_code': codeMsg.SUCCESS,//响应代码200,//成功
                      'result_data': msg//相应数据
                    });
                    //如果session_key没有修改session_key
                  } else {
                    userModel.updateIdByAppIdPassword(_openid, _session_key, (err, resultUpdate) => {
                      //检验数据库错误
                      responseCode.errorCode(res, err);
                      if (parseInt(resultUpdate.n) === 0) {
                        res.send({
                          'success_code': codeMsg.CREATE_UPDATE_ERROR,//响应代码200,//成功
                          'result_data': []//相应数据
                        });
                        return;
                      }
                      let msg = {
                        '_id': md6.encryption((results._id).toString(), _openid),
                        'jurisdiction': results.jurisdiction,
                        'session_key': md6.encryption((_session_key).toString(), _openid),
                        'code': md6.encryption((results.code).toString(), _openid),
                        'studentId': md6.encryption((results.studentId).toString(), _openid)
                      };
                      res.send({
                        'success_code': codeMsg.SUCCESS,//响应代码200,//成功
                        'result_data': msg//相应数据
                      });
                    });
                  }
                });
              } else {
                if (result.password === _session_key) {
                  let msg = {
                    '_id': md6.encryption((result._id).toString(), _openid),
                    'jurisdiction': result.jurisdiction,
                    'session_key': md6.encryption((result.password).toString(), _openid),
                    'code': md6.encryption((result.code).toString(), _openid),
                    'studentId': md6.encryption((result.studentId).toString(), _openid)
                  };
                  res.send({
                    'success_code': codeMsg.SUCCESS,//响应代码200,//成功
                    'result_data': msg//相应数据
                  });
                } else {
                  userModel.updateIdByAppIdPassword(_openid, _session_key, (err, resultUpdate) => {
                    //检验数据库错误
                    responseCode.errorCode(res, err);
                    if (parseInt(resultUpdate.n) === 0) {
                      res.send({
                        'success_code': codeMsg.CREATE_UPDATE_ERROR,//响应代码200,//成功
                        'result_data': []//相应数据
                      });
                      return;
                    }
                    let msg = {
                      '_id': md6.encryption((result._id).toString(), _openid),
                      'jurisdiction': md6.encryption((result.jurisdiction).toString(), _openid),
                      'session_key': md6.encryption((_session_key).toString(), _openid),
                      'code': md6.encryption((result.code).toString(), _openid),
                      'studentId': md6.encryption((result.studentId).toString(), _openid)
                    };
                    res.send({
                      'success_code': codeMsg.SUCCESS,//响应代码200,//成功
                      'result_data': msg//相应数据
                    });
                  });
                }
              }
            }
          });
        } else {
          res.send({
            'success_code': codeMsg.DATA_BASE_ERROR,//401,//数据库错误
            'result_data': []//相应数据
          });
        }
      }
    })
  }
};