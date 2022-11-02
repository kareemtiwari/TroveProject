var express = require('express');
const {Account: accountModel} = require('../db/Objects/account');
var router = express.Router(); //NEEDED TO USE DATABASE OBJECT
let goalModel = require('../db/Objects/dbGoals.js').DbGoals;   //NEEDED TO USE DATABASE OBJECT

/**
 * GET router - this is what is called when this routers path is hit with an HTTP get request
 * This usually happens when a user navigated to your page, or refreshes the page
 */
router.get('/',  async function(req, res, next) {
    let uid = req.session.userID;
    //TODO : have to check if there is a userID in the session
    //get the currently logged in user
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
        }
    }
    // //TODO : have to check if there is a user

    res.render('Goals', {display: gd}); //TODO : model doesn't have all
    // console.log(user.id);
});

/**
 * POST router - this is what is called when this routers path is hit with an HTTP post request
 * This usually happens when a user has clicked submit on a form, or is otherwise sending data to your site
 */
router.post('/add', async function(req, res, next) {
    console.log(req.url);
    console.log(req.body);

    session = req.session;
    uid = req.session.userID; //need to check if there is one - [also eventually need to check if they are being brute forced??]
    let gID = req.body["goalID"];  //get all variables out of the form

    let gAmount = req.body["goalAmount"];
    gAmount = parseInt(gAmount);
    let gProgress = req.body["goalProgress"];
    gProgress = parseInt(gProgress);
    let gName = req.body["goalName"];
    let gSlider = req.body["goalSlider"];
    console.log(gID, gAmount, gProgress, gName, gSlider);


    newGoal = await goalModel.create({userID: uid, goalID: gID, goalAmount: gAmount, goalProgress: gProgress, goalName: gName,goalSlider: gSlider});
    let query = await goalModel.findAll({raw:true});
    console.log(query);
    console.log("***Goal***"+gID+" Created");
    //,{where:{userID:uid}}
    //res.redirect('/Dashboard');
    //}else{
    // res.render('Goals', {
    //    path: req.originalUrl});    //TODO goals visible


    res.redirect('/TroveAccounting'); //TODO : model doesn't have all
    //}
});
router.post('/delete', async function(req, res, next) {
    console.log(req.url);
    console.log(req.body);

    session = req.session;
    uid = req.session.userID; //need to check if there is one - [also eventually need to check if they are being brute forced??]
    let gID = req.body["goalID"];  //get all variables out of the form

    removeGoal = await goalModel.destroy({where: {userID: uid, goalID: gID}});
    let query = await goalModel.findAll({raw: true});
    console.log(query);
    console.log("***Goal***" + gID + " Deleted");
    res.redirect('/TroveAccounting'); //TODO : model doesn't have all
});
router.post('/addFunds', async function(req, res, next) {
    console.log(req.url);
    console.log(req.body);

    session = req.session;
    uid = req.session.userID; //need to check if there is one - [also eventually need to check if they are being brute forced??]
    let gID = req.body["tempID"];  //get all variables out of the form
    let gProgress = req.body["goalAddFunds"];
    let goalProgress = req.body["goalProgress"];
    let gName = req.body["tempName"];
    let gAmount = req.body["tempAmount"];
    let gSlider = req.body["tempSlider"];
    gProgress = parseInt(gProgress);
    console.log(gID, gProgress);



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
///The remove and add destroy the values and add more values to update the progress
    if (goal.goalProgress+gProgress >= goal.goalAmount){
        removeGoal = await goalModel.destroy({where: {userID: uid, goalID: gID}});
        console.log("Goal number "+ gID +" COMPLETED!");
    }
    else{
        removeGoal = await goalModel.destroy({where: {userID: uid, goalID: gID}});
        newGoal = await goalModel.create({userID: uid, goalID: gID, goalAmount: gAmount, goalProgress: goal.goalProgress += gProgress, goalName: gName,goalSlider: gSlider});
        console.log("***Goal***" + gID + " Funds Added");
    }


    res.redirect('/TroveAccounting'); //TODO : model doesn't have all

});

router.post('/deleteFunds', async function(req, res, next) {
    console.log(req.url);
    console.log(req.body);

    session = req.session;
    uid = req.session.userID; //need to check if there is one - [also eventually need to check if they are being brute forced??]
    let gID = req.body["tempID"];  //get all variables out of the form
    let gProgress = req.body["goalDeleteFunds"];
    let goalProgress = req.body["goalProgress"];
    let gName = req.body["tempName"];
    let gAmount = req.body["tempAmount"];
    let gSlider = req.body["tempSlider"];
    gProgress = parseInt(gProgress);
    console.log(gID, gProgress);



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
///The remove and add destroy the values and add more values to update the progress
    if (goal.goalProgress-gProgress < 0){
        console.log("Goal number "+ gID +" is empty :( !");
    }
    else{
        removeGoal = await goalModel.destroy({where: {userID: uid, goalID: gID}});
        newGoal = await goalModel.create({userID: uid, goalID: gID, goalAmount: gAmount, goalProgress: goal.goalProgress -= gProgress, goalName: gName,goalSlider: gSlider});
        console.log("***Goal***" + gID + " Funds Deleted");
    }


    res.redirect('/TroveAccounting'); //TODO : model doesn't have all

});

module.exports = router;  //This allows your router to be used in the main app file