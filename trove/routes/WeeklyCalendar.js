var express = require('express');
const {Account: accountModel} = require("../db/Objects/account");
var router = express.Router();
let eventsModel = require('../db/Objects/events.js').Events;

/* GET Weekly Calendar page. */
router.get('/', async function(req, res, next) {
    let query = await eventsModel.findAll({
        where: {
            userID: 0
        },
        raw : true
    });
    console.log("*** Get all user Events ***");
    console.log(query);

    let eventsList = getEventsList(query);
    console.log(eventsList);
    let dispList = getDsiplayList(eventsList);

    res.render('WeeklyCalendar', {name:'',end:'', wage:'', sun:dispList[0], mon:dispList[1],
        tue:dispList[2], wed:dispList[3], thu:dispList[4], fri:dispList[5], sat:dispList[6], path: req.originalUrl});
});

router.post('/addEvent', async function(req, res, next) {
    let query = await eventsModel.findAll({
        where: {
            userID: 0
        },
        raw : true
    });
    console.log("*** Get all user Events ***");
    console.log(query);

    let eventsList = getEventsList(query);
    console.log(eventsList);
    let dispList = getDsiplayList(eventsList);
    /* Get and Check the New Event Name */
    let eName = req.body["eName"];
    if(eName.length === 0){
        res.render('WeeklyCalendar', {name: 'Event must be named.', end:'', wage:'', sun:dispList[0],
            mon:dispList[1], tue:dispList[2], wed:dispList[3], thu:dispList[4], fri:dispList[5],
            sat:dispList[6], path: req.originalUrl});
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
        res.render('WeeklyCalendar', {name: '', end:'Event end time must be after the start time.',
            wage:'', sun:dispList[0], mon:dispList[1], tue:dispList[2], wed:dispList[3], thu:dispList[4],
            fri:dispList[5], sat:dispList[6], path: req.originalUrl});
        return;
    }

    /* Get and Check the New Event Hourly Wage */
    let eWage = req.body["eHourly"];
    eWage = parseFloat(eWage.replace(",","."));
    if(isNaN(eWage)) {
        res.render('WeeklyCalendar', {name: '', end:'', wage:'Hourly Wage must be a valid number.',
            sun:dispList[0], mon:dispList[1], tue:dispList[2], wed:dispList[3], thu:dispList[4], fri:dispList[5],
            sat:dispList[6],path: req.originalUrl});
        return;
    }


    newEvent = eventsModel.create({eventID:0, userID:0, calendarID:0, eventName:eName, eventDay:eDay,
        eventStartTime:eStart, eventEndTime:eEnd, eventWage:eWage});

    console.log(query);
    console.log("***New Event " + eName + " Created***");
    res.redirect("/Weekly-Calendar");
});

function getEventsList(query) {
    var eventsList = [[],[],[],[],[],[],[]];
    for(let i=0; i < query.length; i++) {
        let newEvent = new Event(query[i].eventName, query[i].eventDay, query[i].eventStartTime,
            query[i].eventEndTime, query[i].eventWage);
        eventsList[newEvent.getDay()].push(newEvent);
        }
    return eventsList;
}

function getDsiplayList(eventsList) {
    var dispList = ['','','','','','',''];
    for(let i=0; i<eventsList.length;i++) {
        if(eventsList[i].length===0) {
            dispList[i] = "<ul><li>No Events On This Day</li></ul>";
        }
        else {
            let text = "<ul>"
            for(let j=0;j<eventsList[i].length;j++) {
                text += "<li>" + eventsList[i][j].printEvent() + "</li>";
            }
            text += "</ul>";
            dispList[i] = text;
        }
    }
    return dispList;
}

class Event {

    /**
     * The Event Constructor - Creates an event and adds it to the User's calendar.
     * @param EventName - type: string - User-given name for their event
     * @param Day - type: int - Integer representing the day of the week (0=Sunday, 6=Saturday)
     * @param StartTime - type: float - Float representation of the event's start time (ex: 9:00am=9.0, 9:30pm=21.5)
     * @param EndTime - type: float - Float representation of the event's end time (ex: 9:00am=9.0, 9:30pm=21.5)
     * @param HourlyWage - type: float - User's hourly pay for this event (cannot be less than 0)
     *
     */
    constructor(EventName, Day, StartTime, EndTime, HourlyWage) {
        this.EventName = EventName;
        this.Day = Day;
        this.StartTime = StartTime;
        this.EndTime = EndTime;
        this.HourlyWage = HourlyWage;
    }
    // Class Setter Methods
    /**
     * Event Name setter method.
     * @param EventName - type: string - User-given name for their event
     */
    setEventName(EventName) {this.EventName = EventName;}

    /**
     * Day setter method.
     * @param Day - type: int - Integer representing the day of the week (0=Sunday, 6=Saturday)
     */
    setDay(Day) {this.Day = Day;}

    /**
     * Event Start Time setter method.
     * @param StartTime - type: float - Float representation of the event's start time (ex: 9:00am=9.0, 9:30pm=21.5)
     */
    setStartTime(StartTime) {this.StartTime = StartTime;}

    /**
     * Event End Time setter method.
     * @param EndTime - type: float - Float representation of the event's end time (ex: 9:00am=9.0, 9:30pm=21.5)
     */
    setEndTime(EndTime) {this.EndTime = EndTime;}

    /**
     * Event Hourly Wage setter method.
     * @param HourlyWage - type: float - User's hourly pay for this event (cannot be less than 0)
     */
    setHourlyWage(HourlyWage) {this.HourlyWage = HourlyWage;}

    // Class Getter Methods

    /**
     * Event Name getter method.
     * @returns {string}
     */
    getEventName() {return this.EventName;}

    /**
     * Day getter method.
     * @returns {int}
     */
    getDay() {return this.Day;}

    /**
     * Event Start Time getter method.
     * @returns {string}
     */
    getStartTime() {
        let minutes = this.StartTime;
        let min = "";
        while(minutes > 1) {
            minutes -= 1;
        }
        switch(minutes){
            case 0.25:
                min = ":15";
                break;
            case 0.5:
                min = ":30";
                break;
            case 0.75:
                min = ":45";
                break;
            default:
                min = ":00";
                break;
        }
        if(this.StartTime - 12 > 0.76) {
            let time = Math.floor(this.StartTime - 12);
            time = time.toString() + min + "pm";
            return time
        }
        else if (this.StartTime - 12 >= 0) {
            let time = Math.floor(this.StartTime);
            time = time.toString() + min + "pm";
            return time
        }
        else {
            let time = Math.floor(this.StartTime);
            return time.toString() + min + "am";
        }
    }

    /**
     * Event End Time getter method.
     * @returns {string}
     */
    getEndTime() {
        let minutes = this.EndTime;
        let min = "";
        while(minutes > 1) {
            minutes -= 1;
        }
        switch(minutes){
            case 0.25:
                min = ":15";
                break;
            case 0.5:
                min = ":30";
                break;
            case 0.75:
                min = ":45";
                break;
            default:
                min = ":00";
                break;
        }
        if(this.EndTime - 12 > 0.76) {
            let time = Math.floor(this.EndTime - 12);
            time = time.toString() + min + "pm";
            return time
        }
        else if (this.EndTime - 12 >= 0) {
            let time = Math.floor(this.EndTime);
            time = time.toString() + min + "pm";
            return time
        }
        else {
            let time = Math.floor(this.EndTime);
            return time.toString() + min + "am";
        }
    }

    /**
     * Hourly Wage getter method.
     * @returns {number}
     */
    getHourlyWage() {return this.HourlyWage;}

    /**
     * Method calculates the number of hours the event spans (EndTime - StartTime).
     * @returns {number}
     */
    calculateNumHours() {
        return this.EndTime - this.StartTime;
    }

    /**
     * Method calculates the income earned from an event (NumHours * HourlyWage).
     * @returns {number}
     */
    calculateEventIncome() {
        return this.calculateNumHours() * this.HourlyWage;
    }

    /**
     * Returns a String representation of an event.
     * @returns {string}
     */
    printEvent() {
        let s = "";
        s += this.EventName + ", ";
        s += this.getStartTime() + " - " + this.getEndTime() + ", ";
        s += "Hourly Wage: $" + this.HourlyWage.toFixed(2).toString() + "/hr, ";
        s += "Event Length: " + this.calculateNumHours().toString() + " hours, ";
        s += "Event Income: $" + this.calculateEventIncome().toFixed(2).toString();
        return s;
    }
}

module.exports = router;
