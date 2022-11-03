# Using the trove server in general
## Quick Note
I am using the trove folder in the root of the repository to put all of the server code into, this means that in order to be used by the server, any code needs to be put in this (or a subfolder of this) directory 
## Useful Documentation
- https://expressjs.com/en/guide/routing.html - About the Router system
- https://sequelize.org/docs/v6/core-concepts/model-querying-basics/ - About the ORM system
## Running the application
- Using a terminal navigate to the "csc450fa22-project-group-4" directory where you have pulled the github repository. 
- Navigate into the trove folder 
- To run the application type "npm start" - you should get the output "Trove server is now running!"
- To vist the page goto https://localhost:3000/ and you should see the homepage [MUST BE HTTPS:// otherwise you will get an empty response]
# Understanding the Express folder structure
- **bin** - This is where the main executable is stored [dont edit]
- **node_modules** - included packages and dependencies for express [dont edit]
- **public** - static HTML goes in the root of this folder, images in the images folder, css in the stylesheets folder, javascripts in the javascripts folder
- **routes** - These are the scripts run depending on the .com/[Directory] (index is used when none are specified) 
- **views** - This is where pages using the pug view manager go 
- **(file) app.js** - This is where you add your routes eventually
- **(file) package.json** -  metadata [dont edit]
# Creating new pages 
## Create the page
Use Pug, static HTML, or build HTML inside the router script. which ever you are more comforatable using, I tried pug, and I'm not sure that it is the right way to go, but I will still leave it as an option for now 
- for static page you just place your file in public, then it is available at http://localhost.com/filename.html
- for pug pages see https://pugjs.org/api/getting-started.html
## Create a route
Routes are only required for dynamic pages, static pages should just work once they are in public

Example "route.js" file for a pug page
```
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {    
  res.render('index', { title: 'Express' });  //res.render(<pug page name>,<any data needed>);
});

module.exports = router;

```
## point "app.js" to your new route
```
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var accSetRouter = require('./routes/accsettings');            // <---- Need to add a line here to create your routing object 

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/accsettings', accSetRouter)                          //  <---- Need to add a line here to use your routing object

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

```
