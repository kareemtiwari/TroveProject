var express = require('express');
const {Account: accountModel} = require('../db/Objects/account');
const {or, INTEGER} = require("sequelize");
var router = express.Router(); //NEEDED TO USE DATABASE OBJECT
let goalModel = require('../db/Objects/dbGoals.js').DbGoals;
let jobsModel = require('../db/Objects/jobs.js').Jobs;
let eventModel = require('../db/Objects/events.js').Events;//NEEDED TO USE DATABASE OBJECT
let expendModel = require('../db/Objects/expenditures.js').Expenditures;
var totalSlider = 100; // holds the total slider value of 100 as a placeholder
var completionField = ''; // field that holds the completed goals value
var flag1 = 0; // flags 1-3 are created in order to negate the creation of multiple goals with the same ID
var flag2 = 0;
var flag3 = 0;

/**
 * GET router - this is what is called when this routers path is hit with an HTTP get request
 * This usually happens when a user navigated to your page, or refreshes the page
 */
router.get('*',  async function(req, res, next) {

    if(req.session.userID != null) {
        if(!req.session.accComplete){
            res.redirect('/accSettings'); //you need to complete your account before being here
        }
        let uid = req.session.userID;
        gd = await queryData(uid);

        //TODO : have to check if there is a userID in the session
        //get the currently logged in user
        res.render('Goals', {completion:completionField,remessage: '',display: gd}); //TODO : model doesn't have all
        // console.log(user.id);

    }else{
        res.redirect('/Trove_Login'); //If the user wants to access the index ,and they are not logged in- redirect to login
    }
});

/**
 * The /add post method is called when the 'Add Goal' button is pressed on the Goals.ejs page is clicked
 * The /add post method creates a goal of ID 1-3
 */
router.post('/add', async function(req, res, next) {
    if(req.session.userID != null) {
        if(!req.session.accComplete){
            res.redirect('/accSettings'); //you need to complete your account before being here
        }

        console.log(req.url);
        console.log(req.body);
        session = req.session;
        uid = req.session.userID;
        gd = await queryData(uid);//need to check if there is one - [also eventually need to check if they are being brute forced??]
        let gID = req.body["goalID"];  //get all variables out of the form
        let gAmount = req.body["goalAmount"]; //The Amount field in the Goals.ejs
        let gProgress = req.body["goalProgress"];//The Progress field in the Goals.ejs
        let gName = req.body["goalName"];//The Name field in the Goals.ejs
        let gSlider = req.body["goalSlider"];//The Slider Bar in the Goals.ejs
        let gSliderSum = 0;
        let gLimit = 0;
        console.log(gSliderSum);
        console.log(gID, gAmount, gProgress, gName, gSlider,gLimit);

        let nGAmount = parseFloat(gAmount); //parsing the amount
        let nGProgress = parseFloat(gProgress); // parsing the progress
        //Checking if the progress or amount fields are empty
        if(isNaN(gAmount) || isNaN(gProgress) || gAmount == '' || gProgress == ''){
            res.render('Goals', {completion:completionField,remessage: 'Error: Please enter a valid non negative integer value in progress or amount',display: gd});
            console.log("NaN catch");
            return;
        }
        // checking if the starting amount is less than zero
        else if (gAmount < 0){
            res.render('Goals', {completion:completionField,remessage: 'Error: Please enter a valid non negative integer value',display: gd});
            console.log("null amount catch");
            return;
        }
        // checking if the starting amount is less than zero
        else if(nGAmount < 0){
            res.render('Goals', {completion:completionField,remessage: 'Error please enter an amount greater than negative one in the amount field',display: gd});
            console.log("null amount 2 catch");
            return;
        }
        //checking if the progress is less than 0
        else if(nGProgress < 0){
            res.render('Goals', {completion:completionField,remessage: 'Error: Please enter a value greater than negative one in the progress field',display: gd});
            console.log(nGProgress)
            console.log("null progress catch");
            return;
        }
        //checking if the progress is less than 0
        else if(nGProgress < 0){
            res.render('Goals', {completion:completionField,remessage: 'Error: Please enter a value greater than negative one in the progress field',display: gd});
            console.log("null progress 2 catch");
            return;
        }
        // checking if the name field is empty
        else if (gName == ""){
            res.render('Goals', {completion:completionField,remessage: 'Error: Please enter a value in the name field!',display: gd});
            console.log("null name catch");
            return;
        }
        // checking the slidertotal doesn't overexceed the slider value currently
        else if (gSlider > totalSlider){
            console.log("Your priority is full you cannot make anymore goals");
            res.render('Goals', {completion:completionField,remessage: 'Error: Slider Value is set to be greater than is allowed, please enter a value lower than '+ totalSlider,display: gd});
            return;
        }
        //checking if the progress is set higher than amount, which if true results in a error
        else if (nGProgress > nGAmount){
            console.log("You cannot make a goal that is already complete");
            console.log(gAmount+' '+gProgress);
            res.render('Goals', {completion:completionField,remessage: 'Error: You cannot set the initial progress higher than the total amount of the goal ',display: gd});
            return;
        }
        // if the exceptions come through false then proceed to make goal
        else{
            gSliderSum = gSliderSum + parseInt(gSlider); //Slider calculation for subtracting from the total slider value of 100
            totalSlider = totalSlider - gSliderSum;

            // Grabbing the event salary, job salary and Expenditures
            let eventQuery = await eventModel.findAll({where: {userID: uid}, raw : true});
            let jobQuery = await jobsModel.findAll({where: {userID: uid}, raw : true});
            let expendQuery = await expendModel.findAll({where: {userID: uid}, raw : true});
            let totalExpend = 0;
            let totalSalary = 0;
            let totalHourly = 0;
            for(let i=0;i<jobQuery.length;i++){
                let job = jobQuery[i];
                if(job.jobType){ //salary
                    totalSalary += job.jobPay/12;
                }else {//hourly
                    for(let j=0;j<eventQuery.length;j++){
                        let event = eventQuery[j];
                        if(event.eventJob == job.jobID){
                            let hours = event.eventEndTime - event.eventStartTime;
                            totalHourly += hours;
                        }
                    }
                }
            }
            for(let i=0;i<expendQuery.length;i++){
                totalExpend += expendQuery[i].value;
            }
            // hourlyWage = (eventGrab.wage)*4
            // salaryWage = (Jobs.jobPay)
            totalHourly *=4;

            let wage = ((totalSalary+totalHourly)-totalExpend)/10.0;
            let priorityMultiplier = gSlider/100;
            let troveLimit = wage * priorityMultiplier;
            gLimit = troveLimit;
            console.log('***************************'+gLimit);

            // if the ID is set to 1 and the flag1 is open then add goal
            if ((gID == 1) & (flag1 == 0)){
                // creating a new goal
                let newGoal = await goalModel.create({userID: uid, goalID: gID, goalAmount: nGAmount, goalProgress: nGProgress, goalName: gName,goalSlider: gSlider,goalLimit: gLimit});
                let query = await goalModel.findAll({where: {
                        userID: uid
                    },raw:true});
                console.log(query);
                console.log("***Goal***"+gID+" Created");
                let gd = await queryData(uid); // MUST COME AFTER UPDATE QUERY FOR PAGE TO UPDATE
                res.render('Goals', {completion:completionField,remessage: "",display: gd});
                flag1 = 1; // set the flag to 1 to indicate the creation of goal 1
                return;
            }
            // if the ID is set to 2 and the flag2 is open then add goal
            else if ((gID == 2) & (flag2 == 0)){
                // creating a new goal
                let newGoal = await goalModel.create({userID: uid, goalID: gID, goalAmount: nGAmount, goalProgress: nGProgress, goalName: gName,goalSlider: gSlider,goalLimit: gLimit});
                let query = await goalModel.findAll({where: {
                        userID: uid
                    },raw:true});
                console.log(query);
                console.log("***Goal***"+gID+" Created");
                let gd = await queryData(uid); // MUST COME AFTER UPDATE QUERY FOR PAGE TO UPDATE
                res.render('Goals', {completion:completionField,remessage: "",display: gd});
                flag2 = 1; // set the flag to 1 to indicate the creation of goal 2
                return;
            }
            // if the ID is set to 3 and the flag3 is open then add goal
            else if ((gID == 3) & (flag3 == 0)){
                // creating a new goal
                let newGoal = await goalModel.create({userID: uid, goalID: gID, goalAmount: nGAmount, goalProgress: nGProgress, goalName: gName,goalSlider: gSlider,goalLimit: gLimit});
                let query = await goalModel.findAll({where: {
                        userID: uid
                    },raw:true});
                console.log(query);
                console.log("***Goal***"+gID+" Created");
                let gd = await queryData(uid); // MUST COME AFTER UPDATE QUERY FOR PAGE TO UPDATE
                res.render('Goals', {completion:completionField,remessage: "",display: gd});
                flag3 = 1; // set the flag to 1 to indicate the creation of goal 3
                return;
                // if any of the cases fails then throw multiple goals error
            }else{
                res.render('Goals', {completion:completionField,remessage: "Error: goal #"+gID+" already exists!",display: gd});
                return;
            }
        }}

    else{
        res.redirect('/Trove_Login'); //If the user wants to access the index ,and they are not logged in- redirect to login
    }
});
/**
 The delete post method deletes a goal which is set by the ID that is selected
 **/
router.post('/delete', async function(req, res, next) {
    if(req.session.userID != null) {
        if(!req.session.accComplete){
            res.redirect('/accSettings'); //you need to complete your account before being here
        }

        console.log(req.url);
        console.log(req.body);

        session = req.session;
        uid = req.session.userID; //need to check if there is one - [also eventually need to check if they are being brute forced??]
        gd = await queryData(uid);

///Calling the individual database elements
        let gID = req.body["goalID"];  //get all variables out of the form
        let gSlider = req.body["goalSlider"];
        let gSliderSum = 0;
        gSliderSum = gSliderSum + parseInt(gSlider); // adds the deleted slider values back to the total
        totalSlider = totalSlider + gSliderSum;
        console.log("You Just Added "+ gSlider +" to "+ totalSlider);
        console.log(totalSlider);
        console.log(gSlider);

// Resetting of the flag dependent on which goal you delete
        if (gID == 1){
            flag1 = 0; // reset flag1 to open
        }
        else if (gID == 2){
            flag2 = 0;// reset flag2 to open
        }
        else if (gID == 3){
            flag3 = 0;// reset flag3 to open
        }
        // destroying the selected goal with the .destroy
        removeGoal = await goalModel.destroy({where: {userID: uid, goalID: gID}});
        let query = await goalModel.findAll({where: {
                userID: uid
            },raw: true});
        console.log(query);
        console.log("***Goal***" + gID + " Deleted");
        gd = await queryData(uid); // MUST COME AFTER UPDATE QUERY FOR PAGE TO UPDATE

        res.render('Goals', {completion:completionField,remessage: '',display: gd});

    }else{
        res.redirect('/Trove_Login'); //If the user wants to access the index ,and they are not logged in- redirect to login
    }
});

router.post('/addFunds', async function(req, res, next) {
    if(req.session.userID != null) {
        if(!req.session.accComplete){
            res.redirect('/accSettings'); //you need to complete your account before being here
        }
        console.log(req.url);
        console.log(req.body);

        session = req.session;
        uid = req.session.userID; //need to check if there is one - [also eventually need to check if they are being brute forced??]
        gd = await queryData(uid);
        let gID = req.body["tempID"];  //get all variables out of the form
        let gProgress = req.body["goalAddFunds"];
        let goalProgress = req.body["goalProgress"];
        let gName = req.body["tempName"];
        let gAmount = req.body["tempAmount"];
        let gSlider = req.body["tempSlider"];
        let gLimit = req.body["tempLimit"];
        let gSliderSum = 0;
        gProgress = parseFloat(gProgress);
        priorityMultiplier = gSlider/100;

        wage = 2000/10;
        gLimit = wage * priorityMultiplier;
        console.log(gID, gProgress);
        console.log(gLimit+" is the number you cant pass!");


        let query = await goalModel.findAll({
            where: {
                userID: uid,
                goalID: gID,
            },
            raw: true
        });

        const goal = query[0];

        console.log(goal);

        console.log(query);
        // checking if the funds are null
        nGProgress = parseFloat(gProgress);
        if(isNaN(gProgress) || nGProgress == null){
            res.render('Goals', {completion:completionField,remessage: '',display: gd});
            console.log("NaN catch");
            return;
        }
        else {
            // if the value being input is above the set limit throw error
            if (gProgress > gLimit) {
                res.render('Goals', {completion:completionField,remessage: "Error: value entered is greater than Trove Limit!",display: gd});
                console.log("Goal number " + gID + " ENTER A VALUE LOWER THAN " + gLimit);
                return;
            }
            /// if the progress is less than zero then throw error
            else if (gProgress < 0){
                res.render('Goals', {completion:completionField,remessage: "Error: Enter a value higher than -1 to the add funds",display: gd});
                console.log("ENTER A VALUE HIGHER THAN -1");
                return;
            }
            else {
                ///The remove and add destroy the values and add more values to update the progress
                if (goal.goalProgress + gProgress >= goal.goalAmount) {
                    if (gID == 1){
                        flag1 = 0;
                    }
                    else if (gID == 2){
                        flag2 = 0;
                    }
                    else if (gID == 3){
                        flag3 = 0;
                    }
                    gSliderSum = gSliderSum + parseInt(gSlider);
                    totalSlider = totalSlider + gSliderSum;
                    completionField = completionField+"Goal "+gName+" completed. ";
                    removeGoal = await goalModel.destroy({where: {userID: uid, goalID: gID}});
                    console.log("Goal number " + gID + " COMPLETED!");

                } else {
                    // add funds to the goal
                    newGoal = await goalModel.update({
                        userID: uid,
                        goalID: gID,
                        goalAmount: gAmount,
                        goalProgress: goal.goalProgress += gProgress,
                        goalName: gName,
                        goalSlider: gSlider,
                        goalLimit: gLimit
                    },{where: {userID:uid,goalID: gID}});
                    console.log("***Goal***" + gID + " Funds Added");
                }
            }
        }

        gd = await queryData(uid); // MUST COME AFTER UPDATE QUERY FOR PAGE TO UPDATE
        res.redirect('/TroveAccounting/#goal'+gID.toString()+'Block');
    }
    else{
        res.redirect('/Trove_Login'); //If the user wants to access the index ,and they are not logged in- redirect to login
    }
});

router.post('/deleteFunds', async function(req, res, next) {
    if(req.session.userID != null) {
        if (!req.session.accComplete) {
            res.redirect('/accSettings'); //you need to complete your account before being here
        }
        console.log(req.url);
        console.log(req.body);

        session = req.session;
        uid = req.session.userID; //need to check if there is one - [also eventually need to check if they are being brute forced??]
        gd = queryData(uid);

        let gID = req.body["tempID"];  //get all variables out of the form
        let gProgress = req.body["goalDeleteFunds"];
        let goalProgress = req.body["goalProgress"];
        let gName = req.body["tempName"]; //changed value here!
        let gAmount = req.body["tempAmount"];
        let gSlider = req.body["tempSlider"];
        let gLimit = req.body["tempLimit"];

        console.log(gID, gProgress);

        let query = await goalModel.findAll({
            where: {
                userID: uid,
                goalID: gID,
            },
            raw: true
        });

        const goal = query[0];

        console.log(goal);

        console.log(query);
        let nGoalProgress = parseFloat(goalProgress);
        let nGProgress = parseFloat(gProgress);
// checks to see if the progress is not null
        if (isNaN(gProgress) || nGProgress == null) {
            res.render('Goals', {completion:completionField,remessage: '',display: gd});
            console.log("NaN catch");

            return;
            ///progress cant be less than zero
        } else if (nGProgress < 0){
            res.render('Goals', {completion:completionField,remessage: "Error: Enter a value higher than -1 to the delete funds",display: gd});
            console.log("ENTER A VALUE HIGHER THAN -1");
            return;
        }
        else {

///The remove and add destroy the values and add more values to update the progress
            if (goal.goalProgress - nGProgress < 0) {
                res.render('Goals', {completion:completionField,remessage: "Error: You overdrew from your progress, please enter a value lower than "+gProgress,display: gd});
                console.log(query);
                return;

            } else {
                // if the progress doesnt go below zero then subtract the given values
                newGoal= await goalModel.update({
                    userID: uid,
                    goalID: gID,
                    goalAmount: gAmount,
                    goalProgress: goal.goalProgress -= nGProgress,
                    goalName: gName,
                    goalSlider: gSlider,
                    goalLimit: gLimit
                },{where: {userID:uid,goalID: gID}});
                console.log("***Goal***" + gID + " Funds Deleted");

            }

        }
        console.log("YOU HAVE REACHED THE LAST GD");
        gd = await queryData(uid); // MUST COME AFTER UPDATE QUERY FOR PAGE TO UPDATE
        res.redirect('/TroveAccounting/#goal'+gID.toString()+'Block');
    }

    else{
        res.redirect('/Trove_Login'); //If the user wants to access the index ,and they are not logged in- redirect to login
    }
});

async function queryData(uid){
    let query = await goalModel.findAll({
        where: {
            userID: uid
        },
        raw : true
    });

    gd = [...Array(3)].map(e => Array(6).fill(""));
    for(let i =0; i<3;i++){
        gd[i]["has"] = query[i] != null;
        if(gd[i]["has"]) {
            gd[i]["goalID"] = query[i].goalID;
            gd[i]["goalAmount"] = query[i].goalAmount;
            gd[i]["goalProgress"] = query[i].goalProgress;
            gd[i]["goalName"] = query[i].goalName;
            gd[i]["goalSlider"] = query[i].goalSlider;
            gd[i]["goalLimit"] = query[i].goalLimit;
        }
    }
    return gd;
}

module.exports = router;  //This allows your router to be used in the main app file
