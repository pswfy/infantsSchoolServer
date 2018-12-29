const mongoose = require('mongoose');
//创建事务Schema
const affairSchema = new mongoose.Schema({
  source:{type:String,required:true},//源
  destination: {type:String,required:true},//目标
  value:{},//修改的值
  state:{type:String,enum:['initial','canceling','pending','committed','done']}
  /**
   * 1.initial:新建事务的状态
   * 2.canceling:回滚事务的状态（应用事务到两个账 ,为done)之前的失败。canceling状态）
   * 3.pending:使用事务的状态(initial之后，应用事务到两个账户）之前的失败。pending状态的)
   * 4.committed:清除事务的状态
   * 5.done:最后事务状态:如果为这个状态就删除
   * */
});

//向外暴露 =>创建模型
module.exports = Affair = mongoose.model('affair', affairSchema);