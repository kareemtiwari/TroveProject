var express = require('express');
var router = express.Router();

/* GET Login page. */
router.get('/', function(req, res, next) {
    res.render('Trove_Login', { title: 'Express' ,path: req.originalUrl});
});

module.exports = router;
