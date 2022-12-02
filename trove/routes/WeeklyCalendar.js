const express = require('express');
const router = express.Router();
let accountModel = require('../db/Objects/account.js').Account;
let eventsModel = require('../db/Objects/events.js').Events;
let jobsModel = require('../db/Objects/jobs.js').Jobs;

/* GET Weekly Calendar page. */
router.get('/', async function(req, res) {
    if(req.session.userID != null) {
        if(!req.session.accComplete){
            res.redirect('/accSettings'); //you need to complete your account before being here
        }
        // Get session user ID
        let uid = req.session.userID;

        /* Get all the current user's events to build the calendar */
        let query = await eventsModel.findAll({where: {userID: uid}, raw : true});

        /* Get user's account information */
        let accountQuery = await accountModel.findAll ({where: {id: uid}, raw : true});

        /* Get all the current user's jobs */
        let jobQuery = await jobsModel.findAll({where: {userID: uid}, raw: true});

        let jobs = getJobOptions(jobQuery);
        let eventsList = getEventsList(query, jobQuery);
        let dispList = getDisplayList(eventsList);
        let events = getEventsOptions(eventsList);

        // Debugging Log Code
        let inc = accountQuery[0].hourlyIncome;
        console.log('*** hourlyIncome = ' + inc.toString() + ' ***');

        if(query.length === 0) {
            res.render('WeeklyCalendar', {name:'',end:'', jobs:jobs, noJob:'', sun:dispList[0], mon:dispList[1],
                tue:dispList[2], wed:dispList[3], thu:dispList[4], fri:dispList[5], sat:dispList[6], events:events,
                dEvent:"none;", dAll:'none', conf:'none', sName:'', path: req.originalUrl});
        }
        else {
            res.render('WeeklyCalendar', {name:'',end:'', jobs:jobs, noJob:'', sun:dispList[0], mon:dispList[1],
                tue:dispList[2], wed:dispList[3], thu:dispList[4], fri:dispList[5], sat:dispList[6], events:events,
                dEvent:"block;", dAll:'block', conf:'none', sName:'', path: req.originalUrl});
        }


    }else{
        res.redirect('/Trove_Login'); //If the user wants to access the index ,and they are not logged in- redirect to log in
    }
});

router.post('*', async function(req, res) {
    if(req.session.userID != null) {
        if(!req.session.accComplete){
            res.redirect('/accSettings'); //you need to complete your account before being here
        }
    // Get session user ID
    let uid = req.session.userID;

    /* Get all the current user's events to build the calendar */
    let query = await eventsModel.findAll({where: {userID: uid}, raw : true});

    /* Get user's account information */
    let accountQuery = await accountModel.findAll ({where: {id: uid}, raw : true});

    /* Get all the current user's jobs */
    let jobQuery = await jobsModel.findAll({where: {userID: uid}, raw: true});

    let jobs = getJobOptions(jobQuery);
    let eventsList = getEventsList(query, jobQuery);
    let dispList = getDisplayList(eventsList);
    let events = getEventsOptions(eventsList);

    /* Begin switch cases for different Post types */
    let type = req.body["type"];
    let nameErr = '';
    let endErr = '';
    switch (type) {
        case 'addEvent':
            /* Get and the event's job */
            let selectedJob = req.body["jobSelector"];
            if(selectedJob === undefined) {
                if(query.length === 0) {
                    res.render('WeeklyCalendar', {name:'',end:'', jobs:jobs,
                        noJob:'You must have a job in Account Settings to create an event.',
                        sun:dispList[0], mon:dispList[1], tue:dispList[2], wed:dispList[3], thu:dispList[4],
                        fri:dispList[5], sat:dispList[6], events:events, dEvent:"none;", dAll:'none', conf:'none',
                        sName:'', path: req.originalUrl});
                }
                else {
                    res.render('WeeklyCalendar', {name:'',end:'', jobs:jobs,
                        noJob:'You must have a Job in Account Settings to create an event.', sun:dispList[0],
                        mon:dispList[1], tue:dispList[2], wed:dispList[3], thu:dispList[4],
                        fri:dispList[5], sat:dispList[6], events:events, dEvent:"block;", dAll:'block', conf:'none',
                        sName:'', path: req.originalUrl});
                }
                return;
            }

            /* Get and Check the New Event Name */
            let eName = req.body["eName"];
            if(eName.length === 0){
                nameErr = 'Event must be named.';
            }

            /* Get the New Event Day */
            let eDay = req.body["eDay"];
            eDay = parseInt(eDay);

            /* Get the New Event Start Time */
            let eStart = req.body["eStart"];
            eStart = parseFloat(eStart.replace(",","."));

            /* Get and Check the New Event End Time */
            let eEnd = req.body["eEnd"];
            eEnd = parseFloat(eEnd.replace(",","."));
            if(eEnd <= eStart){
                endErr = 'Event end time must be after the start time.';
            }

            if(nameErr !== '' || endErr !== '') {
                if(query.length === 0) {
                    res.render('WeeklyCalendar', {name:nameErr,end:endErr,
                        jobs:jobs, noJob:'', sun:dispList[0], mon:dispList[1], tue:dispList[2], wed:dispList[3], thu:dispList[4],
                        fri:dispList[5], sat:dispList[6], events:events, dEvent:"none;", dAll:'none', conf:'none',
                        sName:eName, path: req.originalUrl});
                }
                else {
                    res.render('WeeklyCalendar', {name:nameErr,end:endErr,
                        jobs:jobs, noJob:'', sun:dispList[0], mon:dispList[1], tue:dispList[2], wed:dispList[3], thu:dispList[4],
                        fri:dispList[5], sat:dispList[6], events:events, dEvent:"block;", dAll:'block', conf:'none',
                        sName:eName, path: req.originalUrl});
                }
                return;
            }

            await eventsModel.create({
                userID: uid, eventName: eName, eventDay: eDay,
                eventStartTime: eStart, eventEndTime: eEnd, eventJob: selectedJob
            });

            let selectedJobQuery = await jobsModel.findAll ({where: {jobID: selectedJob, userID: uid}, raw : true});
            let jobType = selectedJobQuery[0].jobType;
            if(jobType) {
                console.log('*** Added Salary Event - No Change to Hourly Income ***');
            }
            else {
                let hourlyPay = selectedJobQuery[0].jobPay;
                let jobHours = eEnd - eStart;
                let eventPay = jobHours * hourlyPay;
                let prevIncome = accountQuery[0].hourlyIncome;
                let newIncome = prevIncome + eventPay;
                await accountModel.update(
                    {hourlyIncome: newIncome},
                    {where:{id: uid}}
                );
                console.log('*** Added ' + eventPay.toString() + ' to Hourly Income ***')
            }
            console.log("***New Event " + eName + " Created***");
            res.redirect("/Weekly-Calendar");
            break;

        case 'deleteEvent':
            let selectedID = req.body["eventSelector"]
            let selectedEvent = await eventsModel.findAll ({where: {eventID: selectedID, userID: uid}, raw : true});
            let jobID = selectedEvent[0].eventJob;
            let selectedJobs = await jobsModel.findAll ({where: {jobID: jobID, userID: uid}, raw : true});
            let selectedType = selectedJobs[0].jobType;
            if(selectedType) {
                console.log('*** Deleted Salary Event - No Change to Hourly Income ***');
            }
            else {
                let hourlyPay = selectedJobs[0].jobPay;
                let jobHours = selectedEvent[0].eventEndTime - selectedEvent[0].eventStartTime;
                let eventPay = jobHours * hourlyPay;
                let prevIncome = accountQuery[0].hourlyIncome;
                let newIncome = prevIncome - eventPay;
                await accountModel.update(
                    {hourlyIncome: newIncome},
                    {where:{id: uid}}
                );
                console.log('*** Deleted ' + eventPay.toString() + ' from Hourly Income ***')
            }
            await eventsModel.destroy({where: {eventID:selectedID,userID:uid}});
            console.log("***Event "+ selectedEvent[0].eventName +" Deleted***" );
            res.redirect("/Weekly-Calendar");
            break;

        case 'deleteAll':
            res.render('WeeklyCalendar', {name:'',end:'', jobs:jobs, noJob:'',
                sun:dispList[0], mon:dispList[1], tue:dispList[2], wed:dispList[3], thu:dispList[4],
                fri:dispList[5], sat:dispList[6], events:events, dEvent:"none;", dAll:'none', conf:'block',
                sName:'', path: req.originalUrl});
            break;

        case 'confirmDeleteAll':
            console.log('*** Confirm Delete All ***');
            for(let i=0; i < query.length; i++) {
                let eID = query[i].eventID;
                console.log('*** Deleted Event ' + eID.toString() + ' ***');
                await eventsModel.destroy({where: {userID: uid, eventID: eID}});
            }
            await accountModel.update(
                {hourlyIncome: 0.0},
                {where:{id: uid}}
            );
            console.log('*** All user events deleted ***')
            res.redirect("/Weekly-Calendar");
            break;
        case 'cancelDeleteAll':
            res.render('WeeklyCalendar', {name:'',end:'', jobs:jobs, noJob:'',
                sun:dispList[0], mon:dispList[1], tue:dispList[2], wed:dispList[3], thu:dispList[4],
                fri:dispList[5], sat:dispList[6], events:events, dEvent:"block;", dAll:'block', conf:'none',
                sName:'',path: req.originalUrl});
            break;
    }
    }else{
        res.redirect('/Trove_Login'); //If the user wants to access the index ,and they are not logged in- redirect to log in
    }
});

/**
 * Function genetates html code to display the job options in the Create Event job selector dropdown.
 * @param jobsQuery
 * @return {string}
 */
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
 * @param jobQuery - query from the database containing all user jobs
 * @returns {*[][]} - nested list containing a list of events for each day
 */
function getEventsList(query, jobQuery) {
    let eventsList = [[],[],[],[],[],[],[]];
    for(let i=0; i < query.length; i++) {
        let job = null;
        for(let j = 0; j < jobQuery.length; j++) {
            if (query[i].eventJob === jobQuery[j].jobID) {
                job = jobQuery[j];
            }
        }
        let newEvent = new Event(query[i].eventID, query[i].eventName, query[i].eventDay, query[i].eventStartTime,
            query[i].eventEndTime, job.jobName, job.jobType, job.jobPay);
        eventsList[newEvent.getDay()].push(newEvent);
        }
    return eventsList;
}

/**
 * Function generates a list of html code to be displayed to the calendar.
 * @param eventsList - eventsList from the getEventsList function
 * @returns {string[]} - a string list of html code for each day on the calendar
 */
function getDisplayList(eventsList) {
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
     * @param JobName - type: string - Name of the event's job
     * @param JobType - type: boolean - Reference to the job's type (true = salary, false = hourly)
     * @param Wage - type: float - hourly pay for the job linked to the event
     */
    constructor(EventID, EventName, Day, StartTime, EndTime, JobName, JobType, Wage) {
        this.EventID = EventID;
        this.EventName = EventName;
        this.Day = Day;
        this.StartTime = StartTime;
        this.EndTime = EndTime;
        this.JobName = JobName;
        this.JobType = JobType;
        this.Wage = Wage;
    }

    // Class Getter Methods
    /**
     * Event ID getter method.
     * @returns {int}
     */
    getEventID() {return this.EventID;}

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

    getJobType() {return this.JobType;}

    getWage() {return this.Wage;}

    calculateEventPay() {
        if (this.JobType) {
            return 0.0;
        }
        else {
            return this.calculateNumHours() * this.Wage;
        }
    }

    calculateNumHours() {
        if(this.JobType) {
            return 0;
        }
        else {
            return this.getEndTime() - this.getStartTime();
        }
    }

    /**
     * Returns a String representation of an event.
     * @returns {string}
     */
    printEvent() {
        let s = "";
        s += this.EventName + " for " + this.JobName + ", ";
        s += this.getStartTime() + " - " + this.getEndTime();
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
        s += " for " + this.JobName;
        return s;
    }
}

module.exports = router;
