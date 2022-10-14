var express = require('express');
var router = express.Router();

/* GET Login page. */
router.get('/', function(req, res, next) {
    res.render('WeeklyCalendar', { title: 'Express' ,path: req.originalUrl});
});

module.exports = router;
