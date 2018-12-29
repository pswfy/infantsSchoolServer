/**
 * session对象
 * @param req
 * @param loginSuccess:标记是否已经登录
 * @param _id:_id
 * @param userName:用户名
 * @param userAvatar:头像
 * @param jurisdiction:权限
 * @param code:代码
 */
exports.sessionCode = (req, loginSuccess, _id, userName, userAvatar, jurisdiction, code) => {
  if (loginSuccess) {
    req.session.loginSuccess = loginSuccess; //表示已经登录true/false
  } else {
    req.session.loginSuccess = null;
  }
  if (_id) {
    req.session._id = _id; //用户id
  } else {
    req.session._id = null;
  }
  if (userName) {
    req.session.userName = userName; //用户名
  } else {
    req.session.userName = null;
  }
  if (userAvatar) {
    req.session.userAvatar = userAvatar; //用户头像
  } else {
    req.session.userAvatar = null;
  }
  if (jurisdiction) {
    req.session.jurisdiction = jurisdiction; //权限
  } else {
    req.session.jurisdiction = 0;
  }
  if (code) {
    req.session.code = code; //学校代码
  } else {
    req.session.code = null;
  }
};


