/**
 * 微信配置
 * @type {{HTTPS: string, APPID: string, SECRET: string, GRANT_TYPE: string}}
 */
const wx = {
  HTTPS:'https://api.weixin.qq.com/sns/jscode2session?',
  APPID:'wxddee9d31066c9545',
  SECRET:'c15e769f04696796eb0ba61d1a73a97c',
  GRANT_TYPE:'authorization_code'
};
module.exports = wx;