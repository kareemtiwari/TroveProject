var express = require('express');
var router = express.Router();

/* GET Login page. */
router.get('/', function(req, res, next) {
  if(req.session.userID != null) {
    res.render('index', {title: 'Express', path: req.originalUrl}); //show index page
  }else{
    res.redirect('/Trove_Login'); //If the user wants to access the index ,and they are not logged in- redirect to login
  }
});

module.exports = router;
