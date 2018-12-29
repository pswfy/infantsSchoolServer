const mongoose = require('mongoose');
//创建Schema
const worktileSchema = new mongoose.Schema({
  createTime: {type: Date, default: Date.now},
  updateTime: {type: Date, default: Date.now},
  /*******权限******---5---*/
  jurisdiction: [Number],
  /*******学校code代码******---5---*/
  code: {type: String,trim: true},
  /*******标题******---5---*/
  title: {type: String, trim: true},
  /*******年******---5---*/
  year:{type:Number},
  /*******月******---5---1,2,3,4,5,6,7,8,9,10,11,12*/
  month:{type:Number},
  /*******日******---5---*/
  date:{type:Number},
  /*******时******---5---0,1,2，3,4,5,6,7,8...23*/
  hour:{type:Number},
  /*******分******---5---0-59*/
  minutes:{type:Number},
  /*******类型******---5---*/
  type:String,
  /*******时序时间******---5---*/
  during:Number
});

//向外暴露 =>创建模型
module.exports = Worktile = mongoose.model('worktile', worktileSchema);

let work =[
  {'title':'画画','year':2017,'month':5,'date':8,'hour':10,'minutes':30,'type':'life','during':20},
  {'title':'看书1','year':2017,'month':5,'date':8,'hour':11,'minutes':0,'type':'life'},
  {'title':'看书2','year':2017,'month':5,'date':8,'hour':12,'minutes':0,'type':'life'},
  {'title':'睡觉','year':2017,'month':5,'date':9,'hour':14,'minutes':0,'type':'life'},
  {'title':'吃药','year':2017,'month':4,'date':20,'hour':10,'minutes':30,'type':'life','during':20},
];
/*
worktileModel.remove({}, function () {
  worktileModel.insertMany(work, (err, data) => {
    console.log(err);
    console.log(data);
  });
});*/
