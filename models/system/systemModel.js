const systemNavSchema = require('./systemNavSchema');
const responseCode = require('../../common/responseCode');
const code = require ('../../common/code');

/**
 * 查询后端菜单权限验证
 * @param req
 * @param res
 * @param next
 */
exports.navMenu = (req, res, next) => {
  //检验用户是否已经登录
  responseCode.loginIn(req, res);
  //检验用户是否已经登录
  let jurisdiction = req.session.jurisdiction;
  if (!jurisdiction && jurisdiction !== 0) {
    res.send({'success_code': code.USER_LOGIN_ERROR, 'result_data': []});
    return;
  }
  let navMenu = [];
  systemNavSchema.findAllMenu((err, result) => {
    /*数据库错误*/
    if (err) {
      res.send(responseCode.response({
        'success_code':code.DATA_BASE_ERROR,
        'result_data': []
      }));
      return;
    }
    /*没有数据*/
    if (Array.isArray(result) && result.length < 1 || result === null || result === {}) {
      res.json({'success_code': code.NO_DATA_SUCCESS, 'result_data': []});
      return;
    }
    /*一级菜单*/
    (function OneMenu(i) {
      if (i === result.length) {
        return;
      }
      if (/^[A-Z]$/.test(result[i].sort)) {
        for (let j = 0; j < result[i].jurisdiction.length; j++) {
          //权限验证
          if (result[i].jurisdiction[j] === jurisdiction) {
            let menu = {
              "_id": result[i]._id,
              "title": result[i].title,
              "sort": result[i].sort,
              "icon": result[i].icon,
              "path":result[i].path,
              "jurisdiction": result[i].jurisdiction,
              "createTime": result[i].createTime,
              "updateTime": result[i].updateTime,
              "TwoMenu": [],
              "ThreeMenu": []
            };
            navMenu.push(menu);
          }
        }
        OneMenu(i + 1);
      }
    })(0);
    /*二级菜单*/
    (function TwoMenu(i) {
      if (i === result.length) {
        return;
      }
      for (let j = 0; j < navMenu.length; j++) {
        if (new RegExp('^(' + navMenu[j].sort + ')([A-Z])$').test(result[i].sort)) {
          for (let k = 0; k < result[i].jurisdiction.length; k++) {
            if (result[i].jurisdiction[k] === jurisdiction) {
              navMenu[j].TwoMenu.push(result[i]);
            }
          }
        }
      }
      TwoMenu(i + 1);
    })(0);
    /*三级菜单*/
    (function ThreeMenu(i) {
      if (i === result.length) {
        return;
      }
      for (let j = 0; j < navMenu.length; j++) {
        for (let k = 0; k < navMenu[j].TwoMenu.length; k++) {
          if (new RegExp('^(' + navMenu[j].TwoMenu[k].sort + ')([A-Z])([A-Z])$').test(navMenu[j].TwoMenu[k].sort)) {
            for (let g = 0; g < navMenu[j].TwoMenu[k].jurisdiction.length; g++) {
              if (result[i].navMenu[j].TwoMenu[k].jurisdiction[g] === jurisdiction) {
                navMenu[j].ThreeMenu.push(result[i]);
              }
            }
          }
        }
      }
      ThreeMenu(i + 1);
    })(0);
    res.send(res.send({'success_code': code.SUCCESS, 'result_data': navMenu}))
  });
};

