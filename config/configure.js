exports.configure = function (req, res, next) {
  if (req.headers.origin === 'http://localhost:8082' || req.headers.origin === 'http://localhost:8083' || req.headers.origin === 'http://localhost:8080') {
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("X-Powered-By", '3.2.1');
    res.header('Access-Control-Allow-Origin: *');
    res.header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept,Authorization");
    res.header('Access-Control-Allow-Methods: GET, POST, PUT,DELETE');
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Access-Token,Authorization");
    res.setHeader("Access-Control-Expose-Headers", "*");
    res.header('Access-Control-Max-Age',1728000);//预请求缓存20天
    res.header("Access-Control-Allow-Origin", req.headers.origin);
  }
  if (req.method === 'OPTIONS') {
    res.send(200);
  }
  else {
    let _send = res.send;
    let sent = false;
    res.send = function (data) {
      if (sent) return;
      _send.bind(res)(data);
      sent = true;
    };
    next();
  }
};