var express = require('express');
const {Account: accountModel} = require("../db/Objects/account");
const {DbGoals: goalModel} = require("../db/Objects/dbGoals");
var router = express.Router();
let eventsModel = require('../db/Objects/events.js').Events;
let jobsModel = require('../db/Objects/jobs.js').Jobs;

/* GET Weekly Calendar page. */
router.get('/', async function(req, res, next) {

    if(req.session.userID != null) {
        if(!req.session.accComplete){
            res.redirect('/accSettings'); //you need to complete your account before being here
        }
        // Get session user ID
        let uid = req.session.userID;

        /* Get all the current user's events to build the calendar */
        let query = await eventsModel.findAll({
            where: {
                userID: uid
            },
            raw : true
        });

        /* Get all the current user's jobs */
        let jobQuery = await jobsModel.findAll({
            where: {
                userID: uid
            },
            raw: true
        });

        let jobs = getJobOptions(jobQuery);
        console.log(jobs);
        let eventsList = getEventsList(query);
        let dispList = getDsiplayList(eventsList);
        let events = getEventsOptions(eventsList);

        if(query.length === 0) {
            res.render('WeeklyCalendar', {name:'',end:'', jobs:jobs, noJob:'', sun:dispList[0], mon:dispList[1],
                tue:dispList[2], wed:dispList[3], thu:dispList[4], fri:dispList[5], sat:dispList[6], events:events,
                dEvent:"none;", dAll:'none', conf:'none', path: req.originalUrl});
        }
        else {
            res.render('WeeklyCalendar', {name:'',end:'', jobs:jobs, noJob:'', sun:dispList[0], mon:dispList[1],
                tue:dispList[2], wed:dispList[3], thu:dispList[4], fri:dispList[5], sat:dispList[6], events:events,
                dEvent:"block;", dAll:'block', conf:'none', path: req.originalUrl});
        }


    }else{
        res.redirect('/Trove_Login'); //If the user wants to access the index ,and they are not logged in- redirect to login
    }
});

router.post('*', async function(req, res, next) {
    if(req.session.userID != null) {
        if(!req.session.accComplete){
            res.redirect('/accSettings'); //you need to complete your account before being here
        }
    // Get session user ID
    let uid = req.session.userID;

    /* Get all the current user's events to build the calendar */
    let query = await eventsModel.findAll({
        where: {
            userID: uid
        },
        raw : true
    });

    /* Get all the current user's jobs */
    let jobQuery = await jobsModel.findAll({
        where: {
            userID: uid
        },
        raw: true
    });

    let jobs = getJobOptions(jobQuery);
    console.log(jobs);
    let eventsList = getEventsList(query);
    let dispList = getDsiplayList(eventsList);
    let events = getEventsOptions(eventsList);

    /* Begin switch cases for different Post types */
    let type = req.body["type"];
    switch (type) {
        case 'addEvent':
            /* Get and Check the New Event Name */
            let eName = req.body["eName"];
            if(eName.length === 0){
                if(query.length === 0) {
                    res.render('WeeklyCalendar', {name: 'Event must be named.',end:'', jobs:jobs, noJob:'',
                        sun:dispList[0], mon:dispList[1], tue:dispList[2], wed:dispList[3], thu:dispList[4],
                        fri:dispList[5], sat:dispList[6], events:events, dEvent:"none;", dAll:'none', conf:'none',
                        path: req.originalUrl});
                }
                else {
                    res.render('WeeklyCalendar', {name: 'Event must be named.',end:'', jobs:jobs, noJob:'',
                        sun:dispList[0], mon:dispList[1], tue:dispList[2], wed:dispList[3], thu:dispList[4],
                        fri:dispList[5], sat:dispList[6], events:events, dEvent:"block;", dAll:'block', conf:'none',
                        path: req.originalUrl});
                }
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
                if(query.length === 0) {
                    res.render('WeeklyCalendar', {name:'',end:'Event end time must be after the start time.',
                        jobs:jobs, noJob:'', sun:dispList[0], mon:dispList[1], tue:dispList[2], wed:dispList[3], thu:dispList[4],
                        fri:dispList[5], sat:dispList[6], events:events, dEvent:"none;", dAll:'none', conf:'none',
                        path: req.originalUrl});
                }
                else {
                    res.render('WeeklyCalendar', {name:'',end:'Event end time must be after the start time.',
                        jobs:jobs, noJob:'', sun:dispList[0], mon:dispList[1], tue:dispList[2], wed:dispList[3], thu:dispList[4],
                        fri:dispList[5], sat:dispList[6], events:events, dEvent:"block;", dAll:'block', conf:'none',
                        path: req.originalUrl});
                }
                return;
            }

            /* Get and the event's job */
            let selectedJob = req.body["jobSelector"]
            console.log(selectedJob);
            if(selectedJob === undefined) {
                if(query.length === 0) {
                    res.render('WeeklyCalendar', {name:'',end:'', jobs:jobs,
                        noJob:'You must have a job in Account Settings to create an event.',
                        sun:dispList[0], mon:dispList[1], tue:dispList[2], wed:dispList[3], thu:dispList[4],
                        fri:dispList[5], sat:dispList[6], events:events, dEvent:"none;", dAll:'none', conf:'none',
                        path: req.originalUrl});
                }
                else {
                    res.render('WeeklyCalendar', {name:'',end:'', jobs:jobs,
                        noJob:'You must have a job in Account Settings to create an event.', sun:dispList[0],
                        mon:dispList[1], tue:dispList[2], wed:dispList[3], thu:dispList[4],
                        fri:dispList[5], sat:dispList[6], events:events, dEvent:"block;", dAll:'block', conf:'none',
                        path: req.originalUrl});
                }
                return;
            }

            let newEvent = eventsModel.create({
                userID: uid, eventName: eName, eventDay: eDay,
                eventStartTime: eStart, eventEndTime: eEnd, eventJob: selectedJob
            });

            console.log(query);
            console.log("***New Event " + eName + " Created***");
            res.redirect("/Weekly-Calendar");
            break;

        case 'editEvent':
            // load the selected event into the form
            // change "Create Event" button text to "Save Changes"
            // delete the old event and save the new event
            //
            break;

        case 'deleteEvent':
            let selectedID = req.body["eventSelector"] // This is the eventID
            let deletedEvent = await eventsModel.destroy({where: {eventID:selectedID,userID:uid}});
            console.log("***Event"+ selectedID +"Deleted***" )
            res.redirect("/Weekly-Calendar");
            break;

        case 'deleteAll':
            res.render('WeeklyCalendar', {name:'',end:'', jobs:jobs, noJob:'',
                sun:dispList[0], mon:dispList[1], tue:dispList[2], wed:dispList[3], thu:dispList[4],
                fri:dispList[5], sat:dispList[6], events:events, dEvent:"none;", dAll:'none', conf:'block',
                path: req.originalUrl});
            break;

        case 'confirmDeleteAll':
            console.log('*** Confirm Delete All ***');
            for(let i=0; i < query.length; i++) {
                let eID = query[i].eventID;
                console.log('*** Deleted Event ' + eID.toString() + ' ***');
                let deletedEvent = await eventsModel.destroy({where: {userID: uid, eventID: eID}});
            }
            console.log('*** All user events deleted ***')
            res.redirect("/Weekly-Calendar");
            break;
        case 'cancelDeleteAll':
            res.render('WeeklyCalendar', {name:'',end:'', jobs:jobs, noJob:'',
                sun:dispList[0], mon:dispList[1], tue:dispList[2], wed:dispList[3], thu:dispList[4],
                fri:dispList[5], sat:dispList[6], events:events, dEvent:"block;", dAll:'block', conf:'none',
                path: req.originalUrl});
            break;
    }
    }else{
        res.redirect('/Trove_Login'); //If the user wants to access the index ,and they are not logged in- redirect to login
    }
});

function getJobOptions(jobsQuery) {
    let jobs = "";
    for(let i=0;i<jobsQuery.length;i++) {
        jobs += "<option value='" + jobsQuery[i].jobID + "'>" + jobsQuery[i].jobName + "</option>";
    }
    return jobs
}

/**
 * Function generates html code to display the options in the Edit/Delete dropdown selector.
 * @param eventsList
 * @returns {string}
 */
function getEventsOptions(eventsList) {
    let events = "";
    for(let i=0;i<eventsList.length;i++) {
        for(let j=0;j<eventsList[i].length;j++) {
            events += "<option value='" + eventsList[i][j].getEventID() + "'>" + eventsList[i][j].shortEvent() + "</option>";
        }
    }
    return events
}

/**
 * Function creates a list of Event types from a given list of database object events.
 * @param query - query from the database containing all user events
 * @returns {*[][]} - nested list containing a list of events for each day
 */
function getEventsList(query) {
    let eventsList = [[],[],[],[],[],[],[]];
    for(let i=0; i < query.length; i++) {
        let newEvent = new Event(query[i].eventID, query[i].eventName, query[i].eventDay, query[i].eventStartTime,
            query[i].eventEndTime, query[i].eventJob);
        eventsList[newEvent.getDay()].push(newEvent);
        }
    return eventsList;
}

/**
 * Function generates a list of html code to be displayed to the calendar.
 * @param eventsList - eventsList from the getEventsList function
 * @returns {string[]} - a string list of html code for each day on the calendar
 */
function getDsiplayList(eventsList) {
    let dispList = ['','','','','','',''];
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


/**
 * A custom data type for Events.
 * Methods-
 * 1. Getters and Setters for every variable.
 * 2. calculateNumHours() - return type: float - Calculates the duration of the event by subtracting the start time
 *      from the end time.
 * 3. calculateEventIncome() - return type: float - Calculates the income earned from the event by multiplying the
 *      duration of the event by the wage.
 * 4. printEvent() - return type: string - returns a string representation of the event and it's data.
 * 5. shortEvent() - return type: string - returns a string containing the event name, job name and day.
 */
class Event {

    /**
     * The Event Constructor - Creates an event and adds it to the User's calendar.
     * @param EventID - type: int - Unique ID for the event
     * @param EventName - type: string - User-given name for their event
     * @param Day - type: int - Integer representing the day of the week (0=Sunday, 6=Saturday)
     * @param StartTime - type: float - Float representation of the event's start time (ex: 9:00am=9.0, 9:30pm=21.5)
     * @param EndTime - type: float - Float representation of the event's end time (ex: 9:00am=9.0, 9:30pm=21.5)
     * @param Job - type:  int - Id refering to the job for the event
     *
     */
    constructor(EventID, EventName, Day, StartTime, EndTime, Job) {
        this.EventID = EventID;
        this.EventName = EventName;
        this.Day = Day;
        this.StartTime = StartTime;
        this.EndTime = EndTime;
        this.Job = Job;
    }
    // Class Setter Methods
    /**
     * Event ID setter method.
     * @param EventID - type: string - User-given name for their event
     */
    setEventID(EventID) {this.EventID = EventID;}

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
     * Event Job setter method.
     * @param JobID - type: string - Refers to the name of the job the user linked to this event
     */
    setJob(JobID) {this.Job = JobID;}

    // Class Getter Methods
    /**
     * Event ID getter method.
     * @returns {int}
     */
    getEventID() {return this.EventID;}

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

    getJob() {return this.Job;}

    /**
     * Method calculates the number of hours the event spans (EndTime - StartTime).
     * @returns {number}
     */
    calculateNumHours() {
        return this.EndTime - this.StartTime;
    }

    // /**
    //  * Method calculates the income earned from an event (NumHours * HourlyWage).
    //  * @returns {number}
    //  */
    // calculateEventIncome() {
    //     return this.calculateNumHours() * this.Wage;
    // }

    /**
     * Returns a String representation of an event.
     * @returns {string}
     */
    printEvent() {
        let s = "";
        s += this.EventName + " for Job " + this.Job.toString() + ", ";
        s += this.getStartTime() + " - " + this.getEndTime() + ", ";
        s += "Event Length: " + this.calculateNumHours().toString() + " hours ";
        return s;
    }

    shortEvent() {
        let s = "";
        s += this.EventName + " on ";
        switch (this.Day) {
            case 0:
                s += "Sunday";
                break;
            case 1:
                s += "Monday";
                break;
            case 2:
                s += "Tuesday";
                break;
            case 3:
                s += "Wednesday";
                break;
            case 4:
                s += "Thursday";
                break;
            case 5:
                s += "Friday";
                break;
            case 6:
                s += "Saturday";
                break;
        }
        s += " for Job " + this.Job.toString();
        return s;
    }
}

module.exports = router;
