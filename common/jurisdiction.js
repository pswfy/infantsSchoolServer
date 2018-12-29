/**
 * 权限管理:
 *  ROOT:最高权限(拥有所有的管理权限) => 0
 *  ADMIN:管理员权限 =>1
 *  SCHOOL:学校权限(拥有管理对应学校的最高权限) =2
 *  SCHOOL_TEACHER:学校下老师的权限 =>3
 *  SCHOOL_LOGISTICS:学校后勤权限 =>4
 *  SCHOOL_FAMILY:家属权限 =>5
 *  ORDINARY:一般用户权限 =>6
 * @type {{ROOT: number, ADMIN: number, SCHOOL: number, SCHOOL_TEACHER: number, SCHOOL_LOGISTICS: number, SCHOOL_FAMILY: number, ORDINARY: number}}
 */
const Jurisdiction = {
  ROOT: 0,
  ADMIN: 1,
  SCHOOL: 2,
  SCHOOL_LOGISTICS: 3,
  SCHOOL_TEACHER: 4,
  SCHOOL_FAMILY: 5,
  ORDINARY: 6
};

module.exports = Jurisdiction;