const GetCustomerIp = (req, callback) => {
  let ipStr =req.ip;
  callback(ipStr);
};

module.exports = GetCustomerIp;