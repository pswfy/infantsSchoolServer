const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
let session = require("express-session");
const logger = require('morgan');
const bodyParser = require('body-parser');
const configure = require('./config/configure');
const mongoose = require('mongoose');
const mongooseURI = require('./config/mongooseURI');



//路由
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const systemRouter = require('./routes/system');
const schoolRouter = require('./routes/school');
const workTileRouter = require('./routes/workTile');
const sessionRouter = require('./routes/session');
const wxRouter = require('./routes/wx');


const app = express();

//链接数据库
mongoose.connect(mongooseURI.mongooseURI,{useNewUrlParser:true,authSource:'admin'});

//express-session
app.use(session({
  secret:'keyboard cat',
  resave:false,
  saveUninitialized:true
}));

//body-parser
app.use(bodyParser.urlencoded({extended: true}));///true:携带cookie
app.use(bodyParser.json());

//跨域
app.all('*',configure.configure);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//路由
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/system', systemRouter);
app.use('/school', schoolRouter);
app.use('/work', workTileRouter);
app.use('/session', sessionRouter);
app.use('/wx', wxRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
