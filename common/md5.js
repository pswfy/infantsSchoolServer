const crypto = require('crypto');

module.exports=function(mingma){
  let md5 = crypto.createHash('md5');
  return md5.update(mingma).digest("base64");
};