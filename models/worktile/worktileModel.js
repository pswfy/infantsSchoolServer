const worktileModel = require('./worktileSchema');
const responseCode = require('../../common/responseCode');
const jurisdictionCode = require('../../common/juriditionCode');

/**
 * 查询本学校的worktile
 * @type {function(*, *, *)}
 */
exports.workTitle = ((req, res, next) => {
  let year = parseInt(req.body.year);
  let month = parseInt(req.body.month);
  //叁数错误
  responseCode.parameterError(res, year, month);
  worktileModel.find({'year': year, 'month': month}, (err, result) => {
    //数据库没有数据
    //responseCode.responseCode(res, err, result);
    let r = [];
    let days = 31;
    if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
      days = 31;
    } else if (month !== 2) {
      days = 30;
    } else if (month === 2) {
      if ((year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0)) {
        days = 29;
      } else {
        days = 28;
      }
    }
    let schedule = null;
    for (let i = 1; i <= days; i++) {
      schedule = result.filter((item) => {
        return item.date === i;
      });
      schedule.sort((a, b) => {
        if (a.hour > b.hour) {
          return 1;
        } else if (a.hour === b.hour) {
          if (a.minutes > b.minutes) {
            return 1;
          }
        }
        return -1;
      });
      r.push({
        'day': i,
        'schedule': schedule
      })
    }
    /*相应对象*/
    responseCode.response(res,r);
  });
});