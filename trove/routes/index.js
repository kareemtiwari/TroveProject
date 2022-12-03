var express = require('express');
var router = express.Router();

/* GET Login page. */
router.get('/', function(req, res, next) {
  if(req.session.userID != null) {
    res.status(200);
    res.render('index', {title: 'Express', path: req.originalUrl}); //show index page
  }else{
    res.status(200);
    res.redirect('/Trove_Login'); //If the user wants to access the index ,and they are not logged in- redirect to login
  }


});

module.exports = router;
