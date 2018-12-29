/**
 * 学校相关的api
 *
 */
const express = require('express');
const schoolModel = require('../models/school/schoolModel');
const router = express.Router();

//根据学校code代码查询学校id
router.get('/get/id/by/code', schoolModel.getCodeSchoolGetId);

//查询所有的学校不分页不排序
router.get('/school', schoolModel.getAllSchool);

//查询所有的学校分页排序
router.get('/school/pages/sort', schoolModel.getAllSchoolPagesSort);

//根据_id查询学校
router.get('/school/id', schoolModel.getOneSchoolById);

//查询所有的课程不分页不排序
router.get('/findSchool/curriculum', schoolModel.getAllCurriculum);

//根据学校id查询本学校所有的课程
router.get('/findSchool/curriculum/id', schoolModel.getSchoolByIdCurriculum);

//查询所有的课程分页排序
router.get('/findSchool/curriculum/page/sort', schoolModel.getAllCurriculumPagesSort);

//根据学校id添加一门课程(加到最后)
router.post('/curriculum/school/by/id', schoolModel.insertOneCurriculumIdBySchoolId);

//根据学校id添加多梦课程
router.post('/curriculum/school/by/id/more', schoolModel.insertOneCurriculumIdBySchoolIdMore);

//根据课程id删除相应的本学校课程
router.post('/curriculum/id/delete',schoolModel.deleteOneCurriculumIdBySchoolById);

//根据课程id修改课程(只能本校)
router.get('/insert/curriculum/id',schoolModel.insertOneCurriculumIdBySchoolById);

//向外暴露
module.exports = router;