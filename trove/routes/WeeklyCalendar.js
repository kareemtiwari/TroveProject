var express = require('express');
var router = express.Router();
let eventsModel = require('../db/Objects/events.js').Events;

/* GET Weekly Calendar page. */
router.get('/', function(req, res, next) {
    res.render('WeeklyCalendar', { title: 'Express' ,path: req.originalUrl});
});

router.post('/', function(req, res, next) {
    res.render('WeeklyCalendar', { title: 'Express' ,path: req.originalUrl});

    let eventName = req.body["eName"];
    console.log(eventName);
});

module.exports = router;
