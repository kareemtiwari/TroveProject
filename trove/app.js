//INCLUDES

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sessions = require('express-session');
var {Sequelize, DataTypes, Model} = require('sequelize');

var indexRouter = require('./routes/Dashboard');
var usersRouter = require('./routes/users');                    //TODO : Include router objects here
var accSetRouter = require('./routes/accSettings');
var LoginRouter = require('./routes/Trove_Login');
var SignUpRouter = require('./routes/Sign_Up');
var dashRouter = require('./routes/Dashboard');
var goalsRouter = require('./routes/GoalsRoute');
var calendarRouter = require('./routes/WeeklyCalendar');

//domain model classes
let accountModel = require('./db/Objects/account.js').Account;
let eventsModel = require('./db/Objects/events.js').Events;
let DbGoalsModel = require('./db/Objects/dbGoals').DbGoals;
let jobsModel = require('./db/Objects/jobs.js').Jobs;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//SETUP

var app = express();    //include express
sequelize = new Sequelize('sqlite::memory:');   //creates a brand-new database every time it runs

accountModel.createModel(sequelize);                            //TODO : Create database models here
DbGoalsModel.createModel(sequelize);                    //create database models
eventsModel.createModel(sequelize);
jobsModel.createModel(sequelize);                       //create database models

testUser = null;
async function createTables(){
  await sequelize.sync();   //create the tables of all the objects initialized
  console.log("created DB tables");

  let testUser = await accountModel.create({firstName: "John", lastName: "Doe",
    email: "johndoe@gmail.com", password:"lolcleartext", accComplete:false, hourlyIncome:57.00},);//create test user
  let testEvent1 = await eventsModel.create({eventID:0, userID:testUser.id, eventName:"Work Shift",
    eventDay:1, eventStartTime:9.0, eventEndTime:17.0, eventJob:0});//create first test event
  let testEvent2 = await eventsModel.create({eventID:1, userID:testUser.id, eventName:"Side Hustle",
    eventDay:6, eventStartTime:10.5, eventEndTime:14.5, eventJob:1});//create second test event
  let testJob1 = await jobsModel.create({jobID:0, userID:testUser.id, jobName:"Salary Job", jobType:true, jobPay:42500.00});//create first test job
  let testJob2 = await jobsModel.create({jobID:1, userID:testUser.id, jobName:"Hourly Job", jobType:false, jobPay:14.25});//create second test job
  console.log("filled with test data");

  //const users = await accountModel.findAll();  //This just prints out a list of all users currently in DB
  //console.log(JSON.stringify(users,null,2));
}
createTables();   //run the above function (asynchronously)

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
//DEFINE ROUTES

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/accSettings', accSetRouter);                      //TODO : tell app to use routes here
app.use('/Trove_Login', LoginRouter);
app.use('/Sign_Up', SignUpRouter);
app.use('/Dashboard/', dashRouter);
app.use('/TroveAccounting/',goalsRouter);
app.use('/Weekly-Calendar', calendarRouter);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//HANDLE ERRORS

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
