var express = require('express');
var router = express.Router();

/* GET Login page. */
router.get('*', function(req, res, next) {
  resp = atob(req.url.substring(1));  //substring to ignore the slash at the beggining
  if(resp == 'error'){
    res.render('AccountSettings', {remessage : 'error' ,path: req.originalUrl});
  }else {
    res.render('AccountSettings', {remessage: 'Initial', path: req.originalUrl});
  }
});

module.exports = router;
