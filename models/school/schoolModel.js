const school = require('./schoolSchema');
const responseCode = require('../../common/responseCode');

/**
 * 根据学校Code查询学校Id
 * @param req
 * @param res
 * @param next
 */
exports.getCodeSchoolGetId = (req, res, next) => {
  //检验用户是否已经登录
  responseCode.loginIn(req, res);
  let codes = req.query.code;
  responseCode.parameterError(res, codes);
  school.findOneSchoolCode(codes, (err, result) => {
    responseCode.responseCodeData(res, err, result);
  });
};
/**
 * 查询所有的学校不分页不排序
 * 需要root权限
 * @param req
 * @param res
 * @param next
 */
exports.getAllSchool = (req, res, next) => {
  school.findSchool((err, result) => {
    responseCode.responseCodeData(res, err, result);
  });
};
/**
 * 查询所有的学校分页排序
 * 需要root权限
 * @param req
 * @param res
 * @param next
 */
exports.getAllSchoolPagesSort = (req, res, next) => {
  let pageSize = parseInt(req.query.pageSize);
  let page = parseInt(req.query.page);
  responseCode.isTypeNaN(res, pageSize, page);
  school.findSchoolPagesSort(pageSize, page, (err, result) => {
    responseCode.responseCodeData(res, err, result);
  });
};
/**
 * 根据学校id查询学校
 * @param req
 * @param res
 * @param next
 */
exports.getOneSchoolById = (req, res, next) => {
  let id = req.query.id;
  responseCode.parameterError(res, id);
  school.findSchoolId(id, (err, result) => {
    responseCode.responseCodeData(res, err, result);
  });
};
/**
 * 查询所有学校所有课程
 * 需要root权限
 * @param req
 * @param res
 * @param next
 */
exports.getAllCurriculum = (req, res, next) => {
  school.findSchoolCurriculum((err, result) => {
    responseCode.responseCodeData(res, err, result);
  });
};
/**
 * 查询所有学校所有课程
 * 需要root权限
 * @param req
 * @param res
 * @param next
 */
exports.getAllCurriculumPagesSort = (req, res, next) => {
  let pageSize = parseInt(req.query.pageSize);
  let page = parseInt(req.query.page);
  responseCode.isTypeNaN(res, pageSize, page);
  school.findSchoolCurriculumPagesSort(pageSize, page, (err, result) => {
    responseCode.responseCodeData(res, err, result);
  });
};
/**
 * 根据学校id查询本学校的所以课程
 * @param req
 * @param res
 * @param next
 */
exports.getSchoolByIdCurriculum = (req, res, next) => {
  let id = req.query.id;
  responseCode.parameterError(res, id);
  school.findSchoolCurriculumId(id, (err, result) => {
    responseCode.responseCodeData(res, err, result);
  });
};
/**
 * 根据学校id添加一门课程(push)
 * @param req
 * @param res
 * @param next
 */
exports.insertOneCurriculumIdBySchoolId = (req, res, next) => {
  let id = req.body.id;
  let name = req.body.name;
  responseCode.parameterError(res, id, name);
  school.insertOneCurriculumId(id, name, (err, result) => {
    console.log(result);
    responseCode.responseCodeInsertUpdate(res, err, result);
  });
};

/**
 * 根据学校id添加多门课程
 * @param req
 * @param res
 * @param next
 */
exports.insertOneCurriculumIdBySchoolIdMore = (req, res, next) => {
  let arr = req.body.arr;
  let id = req.body.id;
  arr = Array.from(arr);
  responseCode.parameterError(res, id);
  responseCode.parameterError(res, arr);
  let msg = true;
  if (msg) {
    for (let i = 0; i < arr.length; i++) {
      school.insertOneCurriculumId(id, arr[i], (err, result) => {
        if (err) {
          msg = false;
          responseCode.responseCodeInsertUpdate(res, err, result);
        }
        if (arr.length = i) {
          msg = false;
          responseCode.responseCodeInsertUpdate(res, err, result);
        }
      });
    }
  }
};
/**
 * 根据课程id删除课程,本学校的id根据code
 * @param req
 * @param res
 * @param next
 */
exports.deleteOneCurriculumIdBySchoolById = (req, res, next) => {
  let SchoolID = req.body.SchoolID;
  let id = req.body.id;
  responseCode.parameterError(res, id, SchoolID);
  school.deleteCurriculumById(SchoolID, id, (err, result) => {
    responseCode.responseCodeDelete(res, err, result);
  });
};
/**
 * 根据课程id修改课程(只能本校)
 * @param req
 * @param res
 * @param next
 */
exports.insertOneCurriculumIdBySchoolById = (req, res, next) => {
  let SchoolID = req.query.SchoolID;
  let id = req.query.id;
  responseCode.parameterError(res, id, SchoolID);
  school.insertCurriculumById(SchoolID, (err, result) => {
    responseCode.responseCode(res, err, result);
    let newFiler = result[0].curriculum.filter((item, index, arr) => {
      return (item._id).toString() === id.toString();
    });
    res.send(newFiler)
  });
};