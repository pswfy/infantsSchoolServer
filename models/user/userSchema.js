const mongoose = require('mongoose');
let ObjectId = require("mongodb").ObjectId;
//创建Schema
const userSchema = new mongoose.Schema({
      /********创建时间/最后修改时间********---1---*/
      createTime: {type: Date, default: Date.now},
      updateTime: {type: Date, default: Date.now},

      /*******用户名******---2---*/
      userName: {type: String, trim: true, required: true, maxlength: 20, minlength: 1, unique: true,},

      /*******appID******---2---*/
      appId: {type: String, unique: true, index: true},

      /*******性别******---2---*/
      gender: {type: Number, default: 0, max: 2, min: 0},

      /*******用户头像******---3---*/
      avatar: {type: String, default: '/avatar/avatar.jpg'},

      /*******密码******微信用户登录时的会话---4---*/
      password: {type: String, trim: true, maxlength: 50, minlength: 6},

      /*******权限******---5---*/
      jurisdiction: {type: Number, default: 6, trim: true, max: 6, min: 0},

      /*******学校code代码******---6---*/
      code: {type: String, default: "400"},

      /*******x家属保留学生的id******---6---*/
      studentId: [String],

      /*******用户端ip******---7---*/
      currentIp: {type: String},

      /*******最后登录时间******---7---*/
      lastTime: {type: Date}

    },
    {versionKey: false, timestamps: {createdAt: 'createTime', updatedAt: 'updateTime'}}
);
/**
 * 根据AppId查询微信用户信息(appId,权限、学生id、学校代码)
 * @param appId
 * @param callback
 */
userSchema.statics.findOneAppId = function (appId, callback) {
  this.model('user').findOne({'appId': appId}, '_id password jurisdiction code studentId', callback);
};

/**
 * 更新session_key
 * @param appId
 * @param session_key
 * @param callback
 */
userSchema.statics.updateIdByAppIdPassword = function (appId, session_key, callback) {
  this.model('user').update({'appId': appId}, {$set: {'password': session_key}}, callback);
};

/**
 * 查询所有不分页不排序
 * @param callback
 */
userSchema.statics.userFindOne = function (callback) {
  this.model('user').findOne(callback);
};
/**
 *  查询所有分页排序
 * @param pageSize
 * @param page
 * @param callback
 */
userSchema.statics.userFindOnePagesSort = function (pageSize, page, callback) {
  let sk = pageSize * page;
  this.model('user').find({}, {}, {limit: pageSize, skip: sk, sort: {'updateTime': -1}}, callback);
};

/**
 * 查询用户名是否存在
 * @param userName
 * @param callback
 */
userSchema.statics.userNameExistence = function (userName, callback) {
  this.model('user').findOne({'userName': userName}, callback);
};
/**
 * 根据id查询用户的权限
 * @param id
 * @param callback
 */
userSchema.statics.findOneJurisdiction = function (id, callback) {
  this.model('user').findOne({'_id': new ObjectId(id)}, 'jurisdiction', callback);
};

/**
 * 登录验证
 * @param userName
 * @param password
 * @param callback
 */
userSchema.statics.userNameAndPasswordExistence = function (userName, password, callback) {
  this.model('user').findOne({"userName": userName, 'password': password}, callback);
};

/**
 * 根据id删除用户
 * @param id
 * @param callback
 */
userSchema.statics.deleteIdByUser = function (id, callback) {
  this.model('user').remove({'_id': new ObjectId(id)}, callback);
};

/**
 * id根据修改密码
 * @param password
 * @param id
 * @param callback
 */
userSchema.statics.updateIdByUserPwd = function (id, password, callback) {
  this.model('user').update({'_id': new ObjectId(id)}, {$set: {'password': password}}, callback);
};
/**
 * 修改权限
 * @param jurisdiction
 * @param id
 * @param callback
 */
userSchema.statics.updateIdByUserJurisdiction = function (id, jurisdiction, callback) {
  this.model('user').update({'_id': new ObjectId(id)}, {$set: {'jurisdiction': jurisdiction}}, callback);
};
/**
 * 修改用户名
 * @param id
 * @param userName
 * @param callback
 */
userSchema.statics.updateIdByUserName = function (id, userName, callback) {
  this.model('user').update({'_id': new ObjectId(id)}, {$set: {'userName': userName}}, callback);
};
/**
 * 修改学校code代码
 * @param id
 * @param code
 * @param callback
 */
userSchema.statics.updateIdByUserCode = function (id, code, callback) {
  this.model('user').update({'_id': new ObjectId(id)}, {$set: {'code': code}}, callback);
};

/**
 * 修改用户端ip
 * @param id
 * @param currentIp
 * @param callback
 */
userSchema.statics.updateIdByUserIp = function (id, currentIp, callback) {
  this.model('user').update({'_id': new ObjectId(id)}, {$set: {'currentIp': currentIp}}, callback);
};

/**
 * 修改用户最后登录时间
 * @param id
 * @param callback
 */
userSchema.statics.updateIdByUserCode = function (id, callback) {
  this.model('user').update({'_id': new ObjectId(id)}, {$set: {'lastTime': new Date()}}, callback);
};

/**
 * 添加家属保留学生的-studentId
 * @param studentId
 * @param callback
 */
userSchema.statics.insertIdByStudentId = function (studentId, callback) {
  this.model('user').update({'_id': new ObjectId(id)}, {$push: {'studentId': studentId}}, callback);
};

/**
 * 删除家属保留学生的-studentId
 * @param id
 * @param studentId
 * @param callback
 */
userSchema.statics.deleteIdByStudentId = function (id, studentId, callback) {
  this.model('user').update({'_id': new ObjectId(id)}, {$pop: {'studentId': studentId}}, callback);
};

//向外暴露 =>创建模型
module.exports = User = mongoose.model('user', userSchema);

/*let user = User({
  userName: 'pswfy',
  password: '123456789',
  jurisdiction: 0,

});*/
/*userModel.create(user, (err, data) => {
  console.log(err);
  console.log(data);
});*/

