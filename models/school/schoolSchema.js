const mongoose = require('mongoose');
let ObjectId = require("mongodb").ObjectId;
//创建Schema
const SchoolSchema = new mongoose.Schema({
  /********创建时间********---1---*/
  createTime: {type: Date, default: Date.now},

  /*******做后修改时间******---2---*/
  updateTime: {type: Date, default: Date.now},

  /*******学校唯一代码******---3---not---null---索引,加密,不能更改*/
  code: {type: String, trim: true, unique: true, required: true},

  /*******学校名称******---4---not---null---*/
  name: {type: String, trim: true, required: true, maxlength: 20, minlength: 2, unique: true},

  /*******logon******---5---not---null---*/
  logo: {type: String, unique: true},

  /*******建校时间******---6---*/
  foundingYear: {type: Date, default: Date.now},

  /*******园长******---7---*/
  principal: {type: String, trim: true, required: true},

  /*******地址******---8---not---null---*/
  address: {type: String, trim: true, unique: true, required: true},

  /*******邮政******---9---not---null---*/
  dak: {type: String, trim: true, required: true, match: /^[a-zA-Z0-9 ]{3,12}$/},

  /*******邮箱******---10---not---null---*/
  email: {
    type: String,
    trim: true,
    required: true,
    match: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
  },

  /*******传真******---11---*/
  fax: {type: String, trim: true, match: /^(\d{3,4}-)?\d{7,8}$/},

  /*******手机号********---12---not---null---*/
  phone: {type: String, trim: true, required: true, match: /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/},

  /************座机*****---13---*/
  telephone: {type: String, trim: true, match: /([0-9]{3,4}-)?[0-9]{7,8}/},

  /*******幼儿园类型******---14---not---null---*/
  schoolType: {type: String, trim: true, required: true,},

  /*******学校经纬度******---15---*/
  longitudeAndLatitude: {longitude: Number, latitude: Number},

  /*******课程******---16---*/
  curriculum: [
    {
      id: mongoose.Schema.Types.ObjectId,
      createTime: {type: Date, default: Date.now},
      updateTime: {type: Date, default: Date.now},
      cuName: {type: String, maxlength: 30, required: true, unique: true, trim: true},
      describe: {type: String, maxlength: 100},
      catalog: [String]
    }
  ],
  /*******工作人员******---17---*/
  workers: [String],//保存用户的id
  /*******班级******---17---*/
  grades: [
    {
      id: mongoose.Schema.Types.ObjectId,//班级_id
      createTime: {type: Date, default: Date.now},
      updateTime: {type: Date, default: Date.now},
      gradesName: String,//班级名称
      headmaster: String,//班主任_id
      subjectTeacher: [String],//老师
      student: [String],//班级的学生
    }
  ],
});

SchoolSchema.statics.findSchool = function (callback) {
  this.model('school').find({}, callback);
};
/**
 * 根据id查询静态方法查询学校
 * @param id
 * @param callback
 */
SchoolSchema.statics.findSchoolId = function (id, callback) {
  this.model('school').findOne({'_id': new ObjectId(id)}, callback);
};
/**
 * 根据学校代码(code)查询学校_id
 * @param code
 * @param callback
 */
SchoolSchema.statics.findOneSchoolCode = function (code, callback) {
  this.model('school').findOne({'code': code}, '_id name', callback);
};
/**
 * 根据学校代码(_id)查询学校名称
 * @param id
 * @param callback
 */
SchoolSchema.statics.findOneSchoolByIdGetMame = function (id, callback) {
  this.model('school').findOne({'_id': new ObjectId(id)}, 'name', callback);
};
/**
 * 静态方法查询所有学校分页排序
 * @param pageSize:也容量
 * @param page:第几页
 * @param callback
 */
SchoolSchema.statics.findSchoolPagesSort = function (pageSize, page, callback) {
  let sk = pageSize * page;
  this.model('school').find({}, {}, {limit: pageSize, skip: sk, sort: {'updateTime': -1}}, callback);
};
/**
 * 查询所有的课程不分页不排序
 * curriculum:只包含课程字段
 * @param callback
 */
SchoolSchema.statics.findSchoolCurriculum = function (callback) {
  this.model('school').find({}, 'curriculum', callback);
};
/**
 * 根据学校id查询所有本学校的课程
 * curriculum:只包含课程字段
 * @param id
 * @param callback
 */
SchoolSchema.statics.findSchoolCurriculumId = function (id, callback) {
  this.model('school').findOne({'_id': new ObjectId(id)}, 'curriculum', callback);
};
/**
 * 查询所有的课程分页排序
 * @param pageSize
 * @param page
 * @param callback
 */
SchoolSchema.statics.findSchoolCurriculumPagesSort = function (pageSize, page, callback) {
  let sk = pageSize * page;
  this.model('school').find({}, 'curriculum', {limit: pageSize, skip: sk, sort: {'updateTime': -1}}, callback);
};
/**
 * 根据学校id添加一门课程(加到最后)
 * @param id
 * @param name
 * @param callback
 */
SchoolSchema.statics.insertOneCurriculumId = function (id, name, callback) {
  this.model('school').update({'_id': new ObjectId(id)}, {
    $push: {
      curriculum: {name: name},
      $position: 0,
      $slice: 3
    }
  }, callback);
};
/**
 * 根据课程id删除课程
 * @param id:学校id
 * @param ido:课程id
 * @param callback
 */
SchoolSchema.statics.deleteCurriculumById = function (id, ido, callback) {
  this.model('school').update({'_id': new ObjectId(id)}, {$pull: {curriculum: {'_id': new ObjectId(ido)}}}, callback);
};
/**
 * 根据课程id查询课程(只能本校)
 * @param id
 * @param callback
 */
SchoolSchema.statics.insertCurriculumById = function (id, callback) {
  this.model('school').find({'_id': new ObjectId(id)}, {'curriculum': 1}, callback);
};
//向外暴露 =>创建模型
module.exports = School = mongoose.model('school', SchoolSchema);

//测试
let data = {
    code: 'WANGFANGYO9',
    name: '天天幼儿园9',
    logo: "/logo/9.jpg",
    principal: '小明是园长9',
    address: '贵阳市南明区南京路29号9',
    dak: '5567059',
    email: '5242499@qq.com',
    fax: '',
    phone: '18285150059',
    telephone: '7384509',
    schoolType: '民办9',
    grades:{
      gradesName: '小(9)班',//班级名称
      headmaster: "班主9",//班主任_id
      subjectTeacher: ['老师1','老师2','老师3','老师4','老师5','老师6'],//老师
      student: ['学生1','学生2','学生3','学生4','学生5','学生6','学生7','学生8','学生9','学生10','学生10','学生12','学生13','学生14','学生15','学生16','学生17','学生18','学生19'],
    },
  };


/*SchoolModel.create(data, (err, data) => {
  console.log(err);
  console.log(data);
  data = null;
});*/
