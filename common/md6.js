const crypto = require('crypto');
/**
 * 加密
 * @param data(加密数据)
 * @param password(钥匙)
 */
exports.encryption = (data, password) => {
  const cipher = crypto.createCipher('aes192', password);
  let crypted = cipher.update(data, 'utf-8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

/**
 * 解密
 * @param data(解密数据)
 * @param password(钥匙)
 */
exports.Decrypt = (data, password) => {
  const decipher = crypto.createDecipher('aes192', password);
  let decrypted = decipher.update(data, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
};