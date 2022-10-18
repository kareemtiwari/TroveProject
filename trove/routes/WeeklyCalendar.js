var express = require('express');
const {Account: accountModel} = require("../db/Objects/account");
var router = express.Router();
let eventsModel = require('../db/Objects/events.js').Events;

/* GET Weekly Calendar page. */
router.get('/', function(req, res, next) {
    res.render('WeeklyCalendar', { log:'', name:'', saved:'', end:'', wage:'', title: 'Express' ,path: req.originalUrl});
});

router.post('/', async function(req, res, next) {
    /* Get and Check the New Event Name */
    let eName = req.body["eName"];
    if(eName.length === 0){
        res.render('WeeklyCalendar', {log:'', name: 'Event must be named.', saved:'', end:'', path: req.originalUrl});
        return;
    }

    /* Get the New Event Day */
    var eDay = req.body["eDay"];
    eDay = parseInt(eDay);

    /* Get the New Event Start Time */
    let eStart = req.body["eStart"];
    eStart = parseFloat(eStart.replace(",","."));

    /* Get and Check the New Event End Time */
    let eEnd = req.body["eEnd"];
    eEnd = parseFloat(eEnd.replace(",","."));
    if(eEnd <= eStart){
        res.render('WeeklyCalendar', {log:'', name: '', saved:'', end:'Event end time must be after the start time.',
            wage:'', path: req.originalUrl});
        return;
    }

    /* Get and Check the New Event Hourly Wage */
    let eWage = req.body["eHourly"];
    eWage = parseFloat(eWage.replace(",","."));
    if(isNaN(eWage)) {
        res.render('WeeklyCalendar', {log:'', name: '', saved:'', end:'',
            wage:'Hourly Wage must be a valid number.', path: req.originalUrl});
        return;
    }


    newEvent = eventsModel.create({eventID:0, eventName:eName, eventDay:eDay, eventStartTime:eStart,
        eventEndTime:eEnd, eventWage:eWage});

    let query = await eventsModel.findAll({raw : true});
    console.log(query);
    console.log("***New Event " + eName + " Created***");
    res.render('WeeklyCalendar', {log:'', name: '', saved: 'Event "' + eName + '" Saved', end:'', wage:'',
        path: req.originalUrl});
});

module.exports = router;
