var express = require('express');
const {Account: accountModel} = require("../db/Objects/account");
const {Events: eventsModel} = require("../db/Objects/events");
const {Jobs: jobsModel} = require("../db/Objects/jobs");
const {DbGoals: goalsModel} = require("../db/Objects/dbGoals");
const {Expenditures: expendModel} = require("../db/Objects/expenditures")
var router = express.Router();

/* GET Login page. */
router.get('/', async function(req, res, next) {
        if(req.session.userID != null) {
                if(!req.session.accComplete){res.redirect('/accSettings');}
        // Get session user ID
        let uid = req.session.userID;
        let query = await accountModel.findAll({where: {id: uid}, raw : true});

        /* Get all the current user's events to build the calendar */
        let events = await eventsModel.findAll({where: {userID: uid}, raw : true});

        /* Get all the current user's jobs */
        let jobQuery = await jobsModel.findAll({where: {userID: uid}, raw: true});

        /* Get all the current user's goals */
        let goalsQuery = await goalsModel.findAll({where: {userID: uid}, raw: true});


        let expendQuery = await expendModel.findAll({where: {userID: uid}, raw: true});

        let eventsList = getEventsList(events, jobQuery);
        let dispList = getDisplayList(eventsList);
        let user = query[0];
        let today = new Date();
        let DoW = today.getDay();
        let day = '';
        switch (DoW) {
                case 0:
                        day += "Sunday";
                        break;
                case 1:
                        day += "Monday";
                        break;
                case 2:
                        day += "Tuesday";
                        break;
                case 3:
                        day += "Wednesday";
                        break;
                case 4:
                        day += "Thursday";
                        break;
                case 5:
                        day += "Friday";
                        break;
                case 6:
                        day += "Saturday";
                        break;
        }
        let goals = '';
        switch(goalsQuery.length) {
                case 0:
                        goals += 'You have no active goals. Click here to add.';
                        break;
                default:
                        for(let i = 0; i < goalsQuery.length; i++) {
                                let goal = goalsQuery[i];
                                let amount = goal.goalAmount;
                                let progress = goal.goalProgress;
                                let perc = ((progress/amount)*100).toFixed(2);
                                goals += '<label for="goal' + i.toString() + '">' + goal.goalName +
                                    ' Progress: ' + perc.toString() + '% </label>';
                                goals += '<progress class="bar" id="goal' + i.toString() + '" value="' + progress.toString() +
                                    '" max="' + amount.toString() + '"></progress><br>';
                        }
        }

                let expend = '';
                switch(expendQuery.length) {
                        case 0:
                                goals += 'You currently have no expenditures.';
                                break;
                        default:
                                let sdata = [];
                                for (let i = 0; i < expendQuery.length; i++) {
                                        let curr = expendQuery[i];
                                        sdata[i] = [curr.name, curr.type, curr.category, curr.value];
                                }
                }
        res.render('Dashboard', {day: day, events: dispList[DoW], goals: goals, userid: user.firstName,dob:date[0],expend:sdata, path: req.originalUrl});
        }else{
                res.redirect('/Trove_Login'); //If the user wants to access the index ,and they are not logged in- redirect to login
        }
});

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
                        dispList[i] = "<ul><li>No Events Today</li></ul>";
                }
                else {
                        let text = "<ul>";
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


