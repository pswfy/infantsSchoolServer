const code = require ('./code');
const ju = require('./jurisdiction');
//响应实体
const response = {
  'success_code': null,//响应代码
  'result_data': null//相应数据
};
/**
 * 创建的相应对象
 * @param res
 * @param err
 */
exports.createResponse = (res,err) =>{
  if(err){
    res.statusCode = code.CREATE_UPDATE_ERROR;
    response.success_code = code.CREATE_UPDATE_ERROR;
    response.result_data = null;
    res.send(response);
    return;
  }
  res.statusCode = code.CREATE_UPDATE_SUCCESS;
  response.success_code = code.CREATE_UPDATE_SUCCESS;
  response.result_data = null;
  res.send(response);
};
/**
 * 数据库错误
 * @param res
 * @param err
 */
exports.errorCode = (res,err) => {
  if (err) {
    res.statusCode = code.DATA_BASE_ERROR;
    response.success_code = code.DATA_BASE_ERROR;
    response.result_data = null;
    res.location('/');
    res.statusCode = 401;
    res.send(response);
  }
};
/**
 * 检验成功
 * @param res
 */
exports.beEqualToSuccess = (res) => {
  res.statusCode = code.BE_EQUAL_TO_SUCCESS;
  response.success_code = code.BE_EQUAL_TO_SUCCESS;
  response.result_data = null;
  res.send(response);
};
/**
 * 检验不成功
 * @param res
 */
exports.beEqualToError = (res) => {
  res.statusCode = code.BE_EQUAL_TO_ERROR;
  response.success_code = code.BE_EQUAL_TO_ERROR;
  response.result_data = null;
  res.send(response);
};

/**
 * 不验证的相应对象
 * @param res
 * @param result
 */
exports.response = (res,result) => {
  res.statusCode = code.SUCCESS;
  response.success_code = code.SUCCESS;
  response.result_data = result;
  res.send(response);
};
/**
 * 校验是否用户已经登录
 * @param req
 * @param res
 */
exports.loginIn = (req,res) => {
  if(!(req.session.loginSuccess)){
    res.statusCode = code.USER_LOGIN_ERROR;
    response.success_code =code.USER_LOGIN_ERROR;
    response.result_data = [];
    res.send(response);
  }
};
/**
 * 无权限
 * @param res
 */
exports.notJurisdiction = (res) => {
  res.statusCode = code.NOT_JURISDICTION;
  response.success_code =code.NOT_JURISDICTION;
  response.result_data = [];
  res.send(response);
};


/**
 * 查询响应对象
 * @param res
 * @param err
 * @param result
 */
exports.responseCodeData = (res, err, result) => {
  if (err) {
    response.success_code = code.DATA_BASE_ERROR;
    response.result_data = null;
    res.statusCode = 401;
    console.log("0");
    res.json(response);
    return;
  }
  if (Array.isArray(result) && result.length < 1 || result===null || result ==={}) {
    response.success_code = code.NO_DATA_SUCCESS;
    response.result_data = [];
    console.log("1");
    //res.json(response);
    res.json("111");
    return;
  }
  response.success_code = code.SUCCESS;
  response.result_data = result;
  res.json(response);
};
/**
 * 相应对象无返回值
 * @param res
 * @param err
 * @param result
 */
exports.responseCode = (res, err, result) => {
  if (err) {
    response.success_code = code.DATA_BASE_ERROR;
    response.result_data = null;
    res.statusCode = 401;
    res.send(response);
    return;
  }
  if (Array.isArray(result) && result.length < 1 || result===null || result ==={} || result ===[]) {
    res.statusCode = code.NO_DATA_SUCCESS;//205数据库没有数据
    response.success_code = code.NO_DATA_SUCCESS;//205数据库没有数据
    response.result_data = [];
    res.send(response);
    return;
  }
};
/**
 * 创建或修改相应对象
 * @param err
 * @param res
 * @param result
 */
exports.responseCodeInsertUpdate = (res, err, result) => {
  if (err) {
    response.success_code = code.DATA_BASE_ERROR;
    response.result_data = null;
    res.statusCode = code.DATA_BASE_ERROR;
    res.json(response);
    return;
  }
  if (parseInt(result.n) === 0) {
    response.success_code = code.CREATE_UPDATE_ERROR;
    response.result_data = null;
    res.statusCode = code.CREATE_UPDATE_ERROR;
    res.json(response);
    return;
  }
  res.statusCode = code.CREATE_UPDATE_SUCCESS;
  response.success_code = code.CREATE_UPDATE_SUCCESS;
  response.result_data = result;
  res.json(response);
};
/**
 * 删除相应对象
 * @param err
 * @param res
 * @param result
 */
exports.responseCodeDelete = (res, err, result) => {
  if (err) {
    response.success_code = code.DATA_BASE_ERROR;
    response.result_data = null;
    res.statusCode = 401;
    res.json(response);
    return;
  }
  if (result.nModified === 0) {
    response.success_code = code.DELETE_ERROR;
    response.result_data = null;
    res.statusCode = 406;
    res.json(response);
    return;
  }
  response.success_code = code.DELETE_SUCCESS;
  response.result_data = result;
  res.json(response);
};
/**
 * 叁数错误
 * @param res
 * @param arr
 */
exports.parameterError = (res, ...arr) => {
  let mgs = false;
  if (!mgs) {
    for (let i = 0; i < arr.length; i++) {
      if (!(arr[i]) && (arr[i]) !== 0) {
        mgs = true;
        break;
      }
    }
  }
  if (mgs) {
    msg = false;
    res.statusCode = code.PARAMETER_ERROR;//402叁数错误
    response.success_code = code.PARAMETER_ERROR;
    response.result_data = null;
    res.location('/');
    res.send(response);
    return;
  }
};
/**
 * 检验_id叁数
 * @param res
 * @param id
 */
exports.parameterErrorId = (res,id) =>{
  if(!id){
    response.success_code = code.PARAMETER_ERROR;
    response.result_data = null;
    res.location('/');
    res.statusCode = 402;
    res.send(response);
    return;
  }
  if(id.length !== 24){
    response.success_code = code.PARAMETER_ERROR;
    response.result_data = null;
    res.location('/');
    res.statusCode = 402;
    res.send(response);
    return;
  }
};
/**
 * 权限叁数校验
 * @param res
 * @param jurisdiction
 */
exports.parameterErrorJurisdiction = (res,jurisdiction) => {
  if (jurisdiction !== ju.ROOT &&
      jurisdiction !== ju.ADMIN &&
      jurisdiction !== ju.SCHOOL &&
      jurisdiction !== ju.SCHOOL_TEACHER &&
      jurisdiction !== ju.SCHOOL_LOGISTICS &&
      jurisdiction !== ju.SCHOOL_FAMILY &&
      jurisdiction !== ju.ORDINARY) {
    res.send({'success_code': code.PARAMETER_ERROR, 'result_data': []});
    return;
  }
};

/**
 * 是否是NaN
 * @param res
 * @param arr
 */
exports.isTypeNaN = (res, ...arr) => {
  let mgs = false;
  for (let i = 0; i < arr.length; i++) {
    if (isNaN(arr[i])) {
      mgs = true;
      break;
    }
  }
  if (mgs) {
    msg = false;
    response.success_code = code.PARAMETER_TYPE_ERROR;
    response.result_data = null;
    res.location('/');
    res.statusCode = 403;
    res.send(response);
  }
};
