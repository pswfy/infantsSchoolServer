const express = require('express');
const captcha = require('svg-captcha');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {title: 'WfY'});
});
//svg生成
router.get('/svg', (req,res,next) => {
  const cap = captcha.createMathExpr({
    noise:5,
    height: 30,
    width:80,
  });
  req.session.captcha = cap.text; // session 存储
  res.type('svg'); // 响应的类型
  res.send(cap.data);
});
//校验svg
router.post('/svg/test', (req,res,next) => {
  let captcha = req.session.captcha;
  let svg = req.body.svg;
  res.send(captcha===svg);
});

module.exports = router;
