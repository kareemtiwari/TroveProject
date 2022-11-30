var express = require('express');
const {Account: accountModel} = require('../db/Objects/account');
const {or, INTEGER} = require("sequelize");
var router = express.Router(); //NEEDED TO USE DATABASE OBJECT
let goalModel = require('../db/Objects/dbGoals.js').DbGoals;   //NEEDED TO USE DATABASE OBJECT
var totalSlider = 100;
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


    // //TODO : have to check if there is a user

    res.render('Goals', {completion:'',remessage: '',display: gd}); //TODO : model doesn't have all
    // console.log(user.id);

    }else{
        res.redirect('/Trove_Login'); //If the user wants to access the index ,and they are not logged in- redirect to login
    }
});

/**
 * POST router - this is what is called when this routers path is hit with an HTTP post request
 * This usually happens when a user has clicked submit on a form, or is otherwise sending data to your site
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

        nGAmount = parseFloat(gAmount);
        nGProgress = parseFloat(gProgress);
    if(isNaN(gAmount) || isNaN(gProgress) || gAmount == '' || gProgress == ''){
        //res.redirect('/TroveAccounting');
        res.render('Goals', {completion:'',remessage: 'Error: Please enter a valid non negative integer value in progress or amount',display: gd});
        console.log("NaN catch");
        return;
        }
    else if (gAmount < 0){
        //res.redirect('/TroveAccounting');
        res.render('Goals', {completion:'',remessage: 'Error: Please enter a valid non negative integer value',display: gd});
        console.log("null amount catch");
        return;
    }
    else if(nGAmount < 0){
        //res.redirect('/TroveAccounting');
        res.render('Goals', {completion:'',remessage: '',display: gd});
        console.log("null amount 2 catch");
        return;
    }

    else if(nGProgress < 0){
        //res.redirect('/TroveAccounting');
        res.render('Goals', {completion:'',remessage: 'Please enter a ',display: gd});
        console.log(nGProgress)
        console.log("null progress catch");
        return;
    }
    else if(nGProgress < 0){
        //res.redirect('/TroveAccounting');
        res.render('Goals', {completion:'',remessage: '',display: gd});
        console.log("null progress 2 catch");
        return;
    }
    else if (gName == ""){
        //res.redirect('/TroveAccounting');
        res.render('Goals', {completion:'',remessage: '',display: gd});
        console.log("null name catch");
        return;
    }
    else if (gSlider > totalSlider){
            console.log("Your priority is full you cannot make anymore goals");
            //res.redirect('/TroveAccounting'); //TODO : model doesn't have all
        res.render('Goals', {completion:'',remessage: '',display: gd});
            return;

        }

    else{
        gSliderSum = gSliderSum + parseInt(gSlider);
        totalSlider = totalSlider - gSliderSum;



        wage = 2000/10.0;
        priorityMultiplier = gSlider/100;
        let troveLimit = wage * priorityMultiplier;
        gLimit = troveLimit;
        console.log('***************************'+gLimit)


        newGoal = await goalModel.create({userID: uid, goalID: gID, goalAmount: nGAmount, goalProgress: nGProgress, goalName: gName,goalSlider: gSlider,goalLimit: gLimit});
        let query = await goalModel.findAll({raw:true});
        console.log(query);
        console.log("***Goal***"+gID+" Created");
        gd = await queryData(uid); // MUST COME AFTER UPDATE QUERY FOR PAGE TO UPDATE


        res.render('Goals', {completion:'',remessage: "",display: gd});

    }

    }//Goes to if statement with null catches


    else{
        res.redirect('/Trove_Login'); //If the user wants to access the index ,and they are not logged in- redirect to login
    }
});

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
    gSliderSum = gSliderSum + parseInt(gSlider);
    totalSlider = totalSlider + gSliderSum;
    console.log("You Just Added "+ gSlider +" to "+ totalSlider);
    console.log(totalSlider);
    console.log(gSlider);


/// destroys the goal
    removeGoal = await goalModel.destroy({where: {userID: uid, goalID: gID}});

    let query = await goalModel.findAll({raw: true});
    console.log(query);
    console.log("***Goal***" + gID + " Deleted");
    //res.redirect('/TroveAccounting'); //TODO : model doesn't have all
        gd = await queryData(uid); // MUST COME AFTER UPDATE QUERY FOR PAGE TO UPDATE
        res.render('Goals', {completion:'',remessage: '',display: gd});

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
        gProgress = parseFloat(gProgress);
        priorityMultiplier = gSlider/100;
        wage = 2000/10;
        gLimit = wage * priorityMultiplier;
        console.log(gID, gProgress);
        console.log(gLimit+" is the number you cant pass!");


        // updateGoal = await goalModel.create({userID: uid, goalID: gID, goalProgress: gProgress});
        // let query = await goalModel.findAll({raw:true});
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

        nGProgress = parseFloat(gProgress);
        if(isNaN(gProgress) || nGProgress == null){
            res.render('Goals', {completion:'',remessage: '',display: gd});
            console.log("NaN catch");
            return;
        }
        else {

            if (gProgress > gLimit) {
                console.log("Goal number " + gID + " ENTER A VALUE LOWER THAN " + gLimit);
            } else {
                ///The remove and add destroy the values and add more values to update the progress
                if (goal.goalProgress + gProgress >= goal.goalAmount) {

                    res.render('Goals', {completion: 'Goal '+gID+' completed!',remessage: '',display: gd});
                    removeGoal = await goalModel.destroy({where: {userID: uid, goalID: gID}});
                    console.log("Goal number " + gID + " COMPLETED!");

                } else {
                    ///removeGoal = await goalModel.destroy({where: {userID: uid, goalID: gID}});
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

        //res.redirect('/TroveAccounting'); //TODO : model doesn't have all
        gd = await queryData(uid); // MUST COME AFTER UPDATE QUERY FOR PAGE TO UPDATE
        res.render('Goals', {completion:'',remessage: '',display: gd});

    }else{
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
        let gName = req.body["tempName"];
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
        nGProgress = parseFloat(gProgress);
        if (isNaN(gProgress) || nGProgress == null) {
            //res.redirect('/TroveAccounting');
            res.render('Goals', {completion:'',remessage: '',display: gd});
            console.log("NaN catch");
            return;
        } else {

///The remove and add destroy the values and add more values to update the progress
            if (goal.goalProgress - gProgress < 0) {
                console.log("Goal number " + gID + " is empty :( !");
                ///removeGoal = await goalModel.destroy({where: {userID: uid, goalID: gID}});
                newGoal= await goalModel.update({
                    userID: uid,
                    goalID: gID,
                    goalAmount: gAmount,
                    goalProgress: 0,
                    goalName: gName,
                    goalSlider: gSlider,
                    goalLimit: gLimit
                },{where: {userID:uid,goalID: gID}});
            } else {
                ///removeGoal = await goalModel.destroy({where: {userID: uid, goalID: gID}});
                newGoal= await goalModel.update({
                    userID: uid,
                    goalID: gID,
                    goalAmount: gAmount,
                    goalProgress: goal.goalProgress -= gProgress,
                    goalName: gName,
                    goalSlider: gSlider,
                    goalLimit: gLimit
                },{where: {userID:uid,goalID: gID}});
                console.log("***Goal***" + gID + " Funds Deleted");
            }


            //res.redirect('/TroveAccounting'); //TODO : model doesn't have all
            gd = await queryData(uid); // MUST COME AFTER UPDATE QUERY FOR PAGE TO UPDATE
            res.render('Goals', {completion:'',remessage: '',display: gd});

        }
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