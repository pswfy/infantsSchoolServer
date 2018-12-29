const userModel = require('./userSchema');
const responseCode = require('../../common/responseCode');
const jurisdictionCode = require('../../common/juriditionCode');
const code = require('../../common/code');
const GetCustomerIp = require('../../common/GetCustomerIp');
const ju = require('../../common/jurisdiction');
const md5 = require('../../common/md5');

/**
 * 后台登录用户名验证
 * @param req
 * @param res
 * @param next
 */
exports.loginUSerName = (req, res, next) => {
  let userName = req.body.userName;
  //叁数校验
  responseCode.parameterError(res, userName);
  //检验用户名
  userModel.userNameExistence(userName, (err, result) => {
    //检验数据库的数据
    responseCode.responseCode(res, err, result);
    //检验成功的相应对象
    responseCode.beEqualToSuccess(res);
  });
};
/**
 * 用户后台登录
 * @param req
 * @param res
 * @param next
 */
exports.login = (req, res, next) => {
  let userName = req.body.userName;
  let passwords = req.body.password;
  /*检验叁数*/
  responseCode.parameterError(res, userName, passwords);
  //MD5解密
  password = md5(md5(passwords) + code.MD5CODE);
  //登录IO
  userModel.userNameAndPasswordExistence(userName, password, (err, result) => {
    //错误
    if (err) {
      res.statusCode = code.DATA_BASE_ERROR;
      res.send({'success_code': code.DATA_BASE_ERROR, 'result_data': []});
      return;
    }
    //没有数据
    if (Array.isArray(result) && result.length < 1 || result === null || result === {}) {
      res.statusCode = code.NO_DATA_SUCCESS;
      res.send({'success_code': code.NO_DATA_SUCCESS, 'result_data': []});
      return;
    }
    //无权限登录
    if (parseInt(result.jurisdiction) === ju.SCHOOL_FAMILY || parseInt(result.jurisdiction) === ju.ORDINARY) {
      res.statusCode = code.NOT_JURISDICTION;
      res.send({'success_code': code.NOT_JURISDICTION, 'result_data': []});
      return;
    }
    //登录成功往session保存用户信息
    jurisdictionCode.sessionCode(req, true, result._id, result.userName, result.avatar, result.jurisdiction, result.code);
    //修改登录的ip
    //todo
    GetCustomerIp(req,(ip) => {
      if(!ip){
        res.statusCode = code.USER_IP_ERROR;
        res.send({'success_code': code.USER_IP_ERROR, 'result_data': []});
        return;
      }
      let id = req.session._id;
      userModel.updateIdByUserIp(id,ip,(err,result) => {
        if(err){
          res.statusCode = code.DATA_BASE_ERROR;
          res.send({'success_code': code.DATA_BASE_ERROR, 'result_data': []});
          return;
        }
        //修改登录时间
        userModel.updateIdByUserCode(id,(err,result) => {
          if(err){
            res.statusCode = code.DATA_BASE_ERROR;
            res.send({'success_code': code.DATA_BASE_ERROR, 'result_data': []});
            return;
          }
          //登录成功的相应对象
          res.statusCode = code.SUCCESS;
          res.send({'success_code': code.SUCCESS, 'result_data': []})
        });
      });
    });
  });
};
/**
 * 创建一个用户
 * 本权限的可以创建自己权限等级和以下权限的用户
 * @param req
 * @param res
 * @param next
 */
exports.createUser = (req, res, next) => {
  //检验用户是否已经登录
  responseCode.loginIn(req, res);
  //用户名
  let userName = req.body.userName;
  //密码
  let password = req.body.password;
  //权限
  let jurisdiction = parseInt(req.body.jurisdiction);
  //MD5加密用户密码
  password = md5(md5(password) + code.MD5CODE);
  //检验必须叁数(用户名/密码/权限)
  responseCode.parameterError(res, userName, password);
  //检验是不是数字(权限)
  responseCode.isTypeNaN(res, jurisdiction);
  //检验权限可选范围
  responseCode.parameterErrorJurisdiction(res, jurisdiction);
  //session的权限
  let diction = req.session.jurisdiction;
  //root(root-系统管理员-学校)(四个必须叁数或三个必须叁数)
  if (diction === ju.ROOT) {
    //root/系统管理员(0,1,2)
    if (jurisdiction === ju.ROOT || jurisdiction === ju.ADMIN) {
      userModel.create({'userName': userName, 'password': password, 'jurisdiction': jurisdiction}, (err, result) => {
        responseCode.createResponse(res, err);
      });
      //学校
    } else if (jurisdiction === ju.SCHOOL) {
      let code = req.body.code;
      responseCode.parameterError(res, code);
      userModel.create({
        'userName': userName,
        'code': code,
        'password': password,
        'jurisdiction': jurisdiction
      }, (err, result) => {
        responseCode.createResponse(res, err);
      });
      //无权限
    } else {
      responseCode.notJurisdiction(res)
    }
    //系统管理员(可以创建系统管理员-学校)(四个必须叁数或三个必须叁数)
  } else if (diction === ju.ADMIN) {
    //root/系统管理员
    if (jurisdiction === ju.ADMIN) {
      userModel.create(({'userName': userName, 'password': password, 'jurisdiction': jurisdiction}), (err, result) => {
        responseCode.createResponse(res, err);
      });
      //学校
    } else if (jurisdiction === ju.SCHOOL) {
      let code = req.body.code;
      responseCode.parameterError(res, code);
      userModel.create(({
        'userName': userName,
        'code': code,
        'password': password,
        'jurisdiction': jurisdiction
      }), (err, result) => {
        responseCode.createResponse(res, err);
      });
      //无权限
    } else {
      responseCode.notJurisdiction(res)
    }
    //学校(可以创建-学校-后勤-老师)(三个必须叁数-权限是学校,后勤管理员，老师)
  } else if (diction === ju.SCHOOL) {
    if (jurisdiction === ju.SCHOOL || jurisdiction === ju.SCHOOL_TEACHER || jurisdiction === ju.SCHOOL_LOGISTICS) {
      userModel.create(({
        'userName': userName,
        code: req.session.code,
        'password': password,
        'jurisdiction': jurisdiction
      }), (err, result) => {
        responseCode.createResponse(res, err);
      });
    } else {
      responseCode.notJurisdiction(res)
    }

    //学校后勤管理员(可以创建老师-后勤)
  } else if (diction === ju.SCHOOL_LOGISTICS) {
    if (jurisdiction === ju.SCHOOL_TEACHER || jurisdiction === ju.SCHOOL_LOGISTICS) {
      userModel.create(({
        'userName': userName,
        code: req.session.code,
        'password': password,
        'jurisdiction': jurisdiction,
      }), (err, result) => {
        responseCode.createResponse(res, err);
      });
    } else {
      responseCode.notJurisdiction(res)
    }
    //无权限
  } else {
    responseCode.notJurisdiction(res)
  }
};
/**
 * 删除一个用户
 * @param req
 * @param res
 * @param next
 */
exports.deleteUser = (req, res, next) => {
  //检验用户是否已经登录
  responseCode.loginIn(req, res);
  //session的权限
  let diction = req.session.jurisdiction;
  //一个叁数id
  let id = req.body.id;
  //叁数校验
  responseCode.parameterErrorId(res, id);
  //根据id查询删除目标用户的权限
  userModel.findOneJurisdiction(id, (err, result) => {
    //校验数据库错误或没有相应数据
    if (!result) {
      responseCode.responseCode(res, err, result);
      return;
    }
    let _id = result._id;
    let _jurisdiction = result.jurisdiction;
    //id检验是否相等
    if (parseInt(id) !== parseInt(_id)) {
      responseCode.responseCode(res, err, null);
    }
    /*权限大的可以删除权限小的-权限小的不能删除权限大的*/
    if (parseInt(diction) <= parseInt(_jurisdiction)) {
      userModel.deleteIdByUser(id, (err, result) => {
        responseCode.responseCodeInsertUpdate(res, err, result);
      });
    } else {//无权限
      responseCode.notJurisdiction(res)
    }
  });
};
/**
 * 用户退出
 * @param req
 * @param res
 * @param next
 */
exports.exit = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      res.send({'success_code': code.USER_EXIT_ERROR, 'result_data': []});
    } else {
      res.send({'success_code': code.USER_EXIT_SUCCESS, 'result_data': []});
    }
  });
};
/**
 * 修改用户权限
 * @param req
 * @param res
 * @param next
 */
exports.diction = (req, res, next) => {
  //检验用户是否已经登录
  responseCode.loginIn(req, res);
  //两个叁数用户id和权限jurisdiction
  let jurisdiction = parseInt(req.body.jurisdiction);
  let id = req.body.id;
  //检验叁数有没有
  responseCode.parameterError(res, jurisdiction, id);
  //叁数校验id是否24位
  responseCode.parameterErrorId(res, id);
  //检验权限可选范围(0-6)
  responseCode.parameterErrorJurisdiction(res, jurisdiction);
  //session中的权限
  let diction = req.session.jurisdiction;
  //root
  if (diction === ju.ROOT) {
    if (jurisdiction === ju.ROOT || jurisdiction === ju.ADMIN || jurisdiction === ju.SCHOOL || jurisdiction === ju.SCHOOL_TEACHER || jurisdiction === ju.SCHOOL_LOGISTICS || jurisdiction === ju.SCHOOL_FAMILY || jurisdiction === ju.ORDINARY) {
      userModel.updateIdByUserJurisdiction(id, jurisdiction, (err, result) => {
        if (result) {
          responseCode.responseCodeInsertUpdate(res, err, result);
        }
      });
    } else {
      responseCode.notJurisdiction(res)
    }
    //admin
  } else if (diction === ju.ADMIN) {
    if (jurisdiction === ju.ADMIN || jurisdiction === ju.SCHOOL || jurisdiction === ju.SCHOOL_TEACHER || jurisdiction === ju.SCHOOL_LOGISTICS || jurisdiction === ju.SCHOOL_FAMILY || jurisdiction === ju.ORDINARY) {
      userModel.updateIdByUserJurisdiction(id, jurisdiction, (err, result) => {
        if (result) {
          responseCode.responseCodeInsertUpdate(res, err, result);
        }
      });
    } else {
      responseCode.notJurisdiction(res)
    }
    //学校
  } else if (diction === ju.SCHOOL) {
    if (jurisdiction === ju.SCHOOL || jurisdiction === ju.SCHOOL_TEACHER || jurisdiction === ju.SCHOOL_LOGISTICS || jurisdiction === ju.SCHOOL_FAMILY || jurisdiction === ju.ORDINARY) {
      userModel.updateIdByUserJurisdiction(id, jurisdiction, (err, result) => {
        if (result) {
          responseCode.responseCodeInsertUpdate(res, err, result);
        }
      });
    } else {
      responseCode.notJurisdiction(res)
    }
    //学校管理员
  } else if (diction === ju.SCHOOL_LOGISTICS) {
    if (jurisdiction === ju.SCHOOL_TEACHER || jurisdiction === ju.SCHOOL_LOGISTICS || jurisdiction === ju.SCHOOL_FAMILY || jurisdiction === ju.ORDINARY) {
      userModel.updateIdByUserJurisdiction(id, jurisdiction, (err, result) => {
        if (result) {
          responseCode.responseCodeInsertUpdate(res, err, result);
        }
      });
    } else {
      responseCode.notJurisdiction(res)
    }
    //老师
  } else if (diction === ju.SCHOOL_TEACHER) {
    if (jurisdiction === ju.SCHOOL_TEACHER || jurisdiction === ju.SCHOOL_FAMILY || jurisdiction === ju.ORDINARY) {
      userModel.updateIdByUserJurisdiction(id, jurisdiction, (err, result) => {
        if (result) {
          responseCode.responseCodeInsertUpdate(res, err, result);
        }
      });
      //无权限
    } else {
      responseCode.notJurisdiction(res)
    }
    //无权限
  }
  else {
    responseCode.notJurisdiction(res)
  }
};
/**
 * 修改登录用户的用户名
 * @param req
 * @param res
 * @param next
 */
exports.updateUserName = (req, res, next) => {
  //检验用户是否已经登录
  responseCode.loginIn(req, res);
  let userName = req.body.userName;
  //检验叁数有没有
  responseCode.parameterError(res, userName);
  let id = req.session._id;
  //IO
  userModel.updateIdByUserName(id,userName,(err,result) => {
    responseCode.responseCodeInsertUpdate(res, err, result)
  });
};
/**
 * 修改密码
 * @param req
 * @param res
 * @param next
 */
exports.updatePassword = (req, res, next) => {
  //检验用户是否已经登录
  responseCode.loginIn(req, res);
  let passwords = req.body.password;
  //检验叁数有没有
  responseCode.parameterError(res, passwords);
  password = md5(md5(passwords) + code.MD5CODE);
  let id = req.session._id;
  //IO
  userModel.updateIdByUserPwd(id,password,(err,result) => {
    responseCode.responseCodeInsertUpdate(res, err, result)
  });
};

/**
 * 家属添加学生id
 * @param req
 * @param res
 * @param next
 */
exports.insertStudentId = (req, res, next) => {};