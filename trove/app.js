var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sessions = require('express-session');
var {Sequelize, DataTypes, Model} = require('sequelize');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');                    //TODO : Include router objects here
var accSetRouter = require('./routes/accSettings');
var LoginRouter = require('./routes/Trove_Login');
var dashRouter = require('./routes/Dashboard');

//domain model classes
let accountModel = require('./db/Objects/account.js').Account;
//var calendarModel = require('./db/name.js');                  //TODO : Add database objects here
//var troveModel = require('./db/name.js');
//var eventModel = require('./db/name.js');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var app = express();

sequelize = new Sequelize('sqlite::memory:');                   //create a brand new empty database everyday

accountModel.createModel(sequelize);                    //create database models
testUser = null;
async function createTables(){
  await sequelize.sync();
  console.log("created DB tables");

  testUser = await accountModel.create({firstName: "John", lastName: "Doe",
    email: "johndoe@gmail.com", password:"lolcleartext"});//create test user
  console.log("filled with test data");

  const users = await accountModel.findAll();
  console.log(JSON.stringify(users,null,2));
}
createTables();

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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/accSettings', accSetRouter);                      //TODO : tell app to use routes here
app.use('/Trove_Login', LoginRouter);
app.use('/Sign_Up',SignUpRouter);
app.use('/Dashboard/', dashRouter);


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
