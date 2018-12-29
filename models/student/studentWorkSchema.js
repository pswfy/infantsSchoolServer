const mongoose = require('mongoose');
let ObjectId = require("mongodb").ObjectId;
//创建考勤Schema
const studentWeekSchema = new mongoose.Schema({
      /********创建时间/最后修改时间********---1---*/
      createTime: {type: Date, default: Date.now},
      updateTime: {type: Date, default: Date.now},
      /*******确认******---6---*/
      complete:{type:Boolean},
      /*******学校code代码******---6---*/
      code: {type: String},
      /*******x家属id******---6---*/
      familyId: {type: String},
      /*******老师id******---6---*/
      TeacherId:{type: String},
      /*******学生id******---6---*/
      studentId: {type: String},
      /*******班级id******---6---*/
      classId:{type: String},
      /*******进入学校时间******---6---*/
      intoDate:{type:Date},
      /*******离开学校时间******---6---*/
      leaveDate:{type:Date},
      /*******请假******---6---*/
      compassionateLeave:{
        type:Number,//1.事假，2.病假
        startDate:Date,
        endDate:Date,
        msg:String
      },
    },
    {versionKey: false, timestamps: {createdAt: 'createTime', updatedAt: 'updateTime'}}
);

//向外暴露 =>创建模型
module.exports = StudentWeek = mongoose.model('studentWeek', studentWeekSchema);
