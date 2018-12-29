const mongoose = require('mongoose');
let ObjectId = require("mongodb").ObjectId;
//创建Schema
const studentSchema = new mongoose.Schema({
      /********创建时间/最后修改时间********---1---*/
      createTime: {type: Date, default: Date.now},
      updateTime: {type: Date, default: Date.now},

      /*******学生名字******---2---*/
      studentName: {type: String, trim: true, required: true, maxlength: 20, minlength: 2, unique: true},

      /*******用户头像******---3---*/
      avatar: {type: String, default: '/avatar/avatar.jpg'},

      /*******班级id******---6---*/
      classId:{type: String},

      /*******学号******---4---*/
      StudentID: {type: String, trim: true, required: true,unique: true, maxlength: 30, minlength: 10},

      /*******权限******---5---*/
      jurisdiction: {type: Number, default: 6, trim: true, required: true, max: 6, min: 0},

      /*******学校code代码******---6---*/
      code: {type: String},

      /*******x家属id******---6---*/
      familyId: [String],

    },
    {versionKey: false, timestamps: {createdAt: 'createTime', updatedAt: 'updateTime'}}
);
//向外暴露 =>创建模型
module.exports = Student = mongoose.model('student', studentSchema);

let student = [
  {studentName:'student0',StudentID:'1234567890',code:'WANGFANGYOU0',familyId:'5bff966f072a5143a815b04f'},
  {studentName:'student1',StudentID:'1234567891',code:'WANGFANGYOU1',familyId:'5bff96bd072a5143a815b050'},
  {studentName:'student2',StudentID:'1234567892',code:'WANGFANGYOU2',familyId:'5bff9714072a5143a815b057'},
  {studentName:'student3',StudentID:'1234567893',code:'WANGFANGYOU3',familyId:'5bff96d3072a5143a815b051'},
  {studentName:'student4',StudentID:'1234567894',code:'WANGFANGYOU4',familyId:'5bff9730072a5143a815b058'},
  {studentName:'student5',StudentID:'1234567895',code:'WANGFANGYOU5',familyId:'5bff96db072a5143a815b052'},
  {studentName:'student6',StudentID:'1234567896',code:'WANGFANGYOU6',familyId:'5bff96e4072a5143a815b053'},
  {studentName:'student7',StudentID:'1234567897',code:'WANGFANGYOU7',familyId:'5bff96eb072a5143a815b054'},
  {studentName:'student8',StudentID:'1234567898',code:'WANGFANGYOU8',familyId:'5bff96f0072a5143a815b055'},
  {studentName:'student9',StudentID:'1234567899',code:'WANGFANGYOU9',familyId:'5bff96f5072a5143a815b056'}
];

/*studentModel.remove({}, function () {
  studentModel.insertMany(student, (err, data) => {
    console.log(err);
    console.log(data);
  });
});*/
