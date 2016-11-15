var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var flash = require('express-flash');
var passport = require('passport');




var AV = require('leanengine');

var APP_ID = '4KzraCcshsibb7z1Dl7AwMph-gzGzoHsz';
var APP_KEY = 'jFDr696BkEnrdGW4Hk3CSArv';

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});
var leanengine = require('leanengine')


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  next();
});
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'blog.fens.me', cookie: { maxAge: 60000 }}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())

app.use(AV.express())

/*app.use('/__engine/1/ping', function(req, res) {
  res.end(JSON.stringify({
    "runtime": "nodejs-" + process.version,
    "version": "custom"
  }));
});*/

// 云函数列表
app.get('/1.1/_ops/functions/metadatas', function(req, res) {
  res.end(JSON.stringify([]));
});


app.use(express.static(path.join(__dirname, 'public')));


routes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
