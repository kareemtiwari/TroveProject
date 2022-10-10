var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sessions = require('express-session');
//var SQLite = require('sqlite3');
var {Sequelize, DataTypes, Model} = require('sequelize');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var accSetRouter = require('./routes/accSettings');
var LoginRouter = require('./routes/Trove_Login');

//domain model classes
//var accountModel = require('./db/Objects/account.js');
//var calendarModel = require('./db/name.js');
//var troveModel = require('./db/name.js');
//var eventModel = require('./db/name.js');

var app = express();

//Integrated Database section (Database option 1)

/*
var mySQL = require('mysql');

var dbConnection = mysql.createConnection({
  host: "localhost",
  user: "troveserver",
  password: "66yEc!#$4{{*89gH"
});

con.connect(function(err){
  if(err) throw err;
  console.log("Connected");
});
 */

/*
let db = new SQLite.Database('./db/trove.db',(err) =>{
  if(err){
    console.error(err.message);
  }
  console.log('connected to trove database');
});
 */

sequelize = new Sequelize('sqlite::memory:');
//accountModel.Account.createModel(sequelize);
/*
User = sequelize.define('User',{
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  }
});
 */

//sessions setup
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
  secret: "535510nS3cr3tK3y$254ji|{}fi42",
  saveUninitialized:true,
  cookie: {maxAge: oneDay },
  resave:false
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
app.use('/users', usersRouter);
//app.use('/accSettings', accSetRouter);
app.use('/Trove_Login', LoginRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  let message = err.message;
  let error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {message: message, error: error});
});

module.exports = app;
