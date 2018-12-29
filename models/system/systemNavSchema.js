const mongoose = require('mongoose');
//创建事务Schema
const systemNavSchema = new mongoose.Schema({
      /********创建时间/最后修改时间********---1---*/
      createTime: {type: Date, default: Date.now},
      updateTime: {type: Date, default: Date.now},
      title: {type: String, trim: true},
      jurisdiction: [Number],
      sort: {type: String, trim: true, uppercase: true},
      icon: {type: String, trim: true},
      path: {type: String, trim: true, lowercase: true}
    },
    {versionKey: false, timestamps: {createdAt: 'createTime', updatedAt: 'updateTime'}});

/**
 *查询所有数据nav
 * @param callback
 */
systemNavSchema.statics.findAllMenu = function (callback) {
  this.model('systemNav').find({}, callback);
};
/**
 * 查询一级菜单
 * @param callback
 */
systemNavSchema.statics.findOneMenu = function (callback) {
  this.model('systemNav').find({'sort': /^[A-Z]$/}, callback);
};
/**
 * 查询二级菜单
 * @param agu
 * @param callback
 */
systemNavSchema.statics.findTwoMenu = function (agu, callback) {
  this.model('systemNav').find({'sort': /^(agu)([A-Z])$/}, callback);
};
/**
 * 查询三级菜单
 * @param agu
 * @param callback
 */
systemNavSchema.statics.findThreeMenu = function (agu, callback) {
  this.model('systemNav').find({'sort': /^(agu)([A-Z])([A-Z])$/}, callback);
};
/**
 * 查询四级菜单
 * @param agu
 * @param callback
 */
systemNavSchema.statics.findFourMenu = function (agu, callback) {
  this.model('systemNav').find({'sort': /^(agu)([A-Z])([A-Z])([A-Z])$/}, callback);
};
/**
 * 查询五级菜单
 * @param agu
 * @param callback
 */
systemNavSchema.statics.findFiveMenu = function (agu, callback) {
  this.model('systemNav').find({'sort': /^(agu)([A-Z])([A-Z])([A-Z])([A-Z])$/}, callback);
};

//向外暴露 =>创建模型
module.exports = SystemNav = mongoose.model('systemNav', systemNavSchema);


let nav = [
  //一级菜单
  {title: '系统管理', sort: 'A', jurisdiction: [0, 1], path: '/system', icon: '/system/images/1.png'},
  {title: '学生管理', sort: 'B', jurisdiction: [0, 2, 3, 4], path: '/student', icon: '/system/images/2.png'},
  {title: '教务管理', sort: 'C', jurisdiction: [0, 2, 3, 4], path: '/teaching', icon: '/system/images/3.png'},
  {title: '人事管理', sort: 'D', jurisdiction: [0, 2, 4], path: '/personnel', icon: '/system/images/4.png'},
  {title: '数据监控', sort: 'E', jurisdiction: [0, 2, 4], path: '/data', icon: '/system/images/5.png'},
  {title: '后勤管理', sort: 'F', jurisdiction: [0, 2, 4], path: '/logistics', icon: '/system/images/6.png'},
  {title: '个人中心', sort: 'G', jurisdiction: [0, 1, 2, 3, 4], path: '/personal', icon: '/system/images/7.png'},
  {title: '招生管理', sort: 'H', jurisdiction: [0, 2, 4], path: '/recruit ', icon: '/system/images/8.png'},
  {title: '设备管理', sort: 'I', jurisdiction: [0, 2, 4], path: '/equipment', icon: '/system/images/9.png'},
  {title: '基础设置', sort: 'J', jurisdiction: [0, 2], path: '/basics', icon: '/system/images/10.png'},
  /*系统管理2*/
  {title: '使用频率', sort: 'AA', jurisdiction: [0, 1], path: '/system/frequency'},
  {title: '活跃指数', sort: 'AB', jurisdiction: [0, 1], path: '/system/active'},
  {title: '系统集成', sort: 'AC', jurisdiction: [0, 1], path: '/system/integration'},
  {title: '角色管理', sort: 'AD', jurisdiction: [0, 1], path: '/system/management'},
  {title: '权限分配', sort: 'AE', jurisdiction: [0], path: '/system/allocation'},
  {title: '用户权限', sort: 'AF', jurisdiction: [0, 1], path: '/system/rights'},
  {title: '登录日志', sort: 'AG', jurisdiction: [0, 1], path: '/system/login'},
  {title: '操作日志', sort: 'AH', jurisdiction: [0, 1], path: '/system/operation'},
  /*学生管理2*/
  {title: '考勤管理', sort: 'BA', jurisdiction: [0, 2, 3, 4], path: '/student/attendance'},
  {title: '家属管理', sort: 'BB', jurisdiction: [0, 2, 3, 4], path: '/student/members'},
  {title: '基本信息', sort: 'BC', jurisdiction: [0, 2, 3, 4], path: '/student/information'},
  {title: '班级管理', sort: 'BD', jurisdiction: [0, 2, 3, 4], path: '/student/class'},
  /*教务管理2*/
  {title: '教学工作', sort: 'CA', jurisdiction: [0, 2, 4], path: '/teaching/teaching'},
  {title: '课程管理', sort: 'CB', jurisdiction: [0, 2, 3, 4], path: '/teaching/curriculum'},
  {title: '成绩管理', sort: 'CC', jurisdiction: [0, 2, 3, 4], path: '/teaching/score'},
  {title: '考务管理', sort: 'CD', jurisdiction: [0, 2, 3, 4], path: '/teaching/affair'},
  {title: '查询统计', sort: 'CE', jurisdiction: [0, 2, 3, 4], path: '/teaching/statistics'},
  {title: '行政办公', sort: 'CF', jurisdiction: [0, 2, 4], path: '/teaching/office'},
  {title: '收费管理', sort: 'CG', jurisdiction: [0, 2, 4], path: '/teaching/charge'},
  {title: '教室管理', sort: 'CH', jurisdiction: [0, 2, 4], path: '/teaching/classroom'},
  /*人事管理2*/
  {title: '考勤管理', sort: 'DA', jurisdiction: [0, 2, 4], path: '/personnel/attendance '},
  {title: '人力资源', sort: 'DB', jurisdiction: [0, 2, 4], path: '/personnel/resources'},
  {title: '宿舍管理', sort: 'DC', jurisdiction: [0, 2, 4], path: '/personnel/management'},
  {title: '通知管理', sort: 'DD', jurisdiction: [0, 2, 4], path: '/personnel/notification'},
  /*数据监控2*/
  {title: '数据预警', sort: 'EA', jurisdiction: [0, 2, 4], path: '/data/warning'},
  /*后勤管理*/
  {title: '教材管理', sort: 'FA', jurisdiction: [0, 2, 4], path: '/logistics/material'},
  {title: '报修管理', sort: 'FB', jurisdiction: [0, 2, 4], path: '/logistics/repair'},
  {title: '办公耗材', sort: 'FC', jurisdiction: [0, 2, 4], path: '/logistics/consumables'},
  {title: '校车管理', sort: 'FD', jurisdiction: [0, 2, 4], path: '/logistics/bus'},
  /*个人中心*/
  {title: '个人设置', sort: 'GA', jurisdiction: [0, 1, 2, 3, 4], path: '/personal/settings'},
  {title: '消息推送', sort: 'GB', jurisdiction: [0, 1, 2, 3, 4], path: '/personal/message'},
  {title: '日历管理', sort: 'GC', jurisdiction: [0, 1, 2, 3, 4], path: '/personal/calendar'},
  {title: '班级管理', sort: 'GD', jurisdiction: [0, 2, 3, 4], path: '/personal/class'},
  {title: '个人事务', sort: 'GE', jurisdiction: [0, 1, 2, 3, 4], path: '/personal/home36'},
  /*招生管理2*/
  {title: '招生计划', sort: 'HA', jurisdiction: [0, 2, 4], path: '/recruit/enrolment '},
  {title: '录取信息', sort: 'HB', jurisdiction: [0, 2, 4], path: '/recruit/information'},
  {title: '新生报到', sort: 'HC', jurisdiction: [0, 2, 4], path: '/recruit/name'},
  {title: '分班管理', sort: 'HD', jurisdiction: [0, 2, 4], path: '/recruit/division '},
  {title: '统计报到', sort: 'HE', jurisdiction: [0, 2, 4], path: '/recruit/report'},
  {title: '信息导出', sort: 'HF', jurisdiction: [0, 2, 4], path: '/recruit/export'},
  /*设备管理2*/
  {title: '办公器材', sort: 'IA', jurisdiction: [0, 2, 4], path: '/equipment/equipment'},
  {title: '楼宇管理', sort: 'IB', jurisdiction: [0, 2, 4], path: '/equipment/management'},
  {title: '场地管理', sort: 'IC', jurisdiction: [0, 2, 4], path: '/equipment/Site '},
  /*基础设置2*/
  {title: '基本信息', sort: 'JA', jurisdiction: [0, 2], path: '/basics/info'},
];

/*systemNavModel.remove({}, function () {
  systemNavModel.insertMany(nav, (err, data) => {
    console.log(err);
    console.log(data);
  });
});*/
