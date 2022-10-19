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

    // correct = true;
    // if(!/^([A-Za-z]{1,15})$/.test(goalName)) {
    //     res.render('Goals', {remessage: 'Goal Name must be 1-15 Letters only', path: req.originalUrl});
    //     return;
    // }
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
// router.post('/delete', async function(req, res, next) {
//     console.log(req.url);
//     console.log(req.body);
//
//     session = req.session;
//     uid = req.session.userID; //need to check if there is one - [also eventually need to check if they are being brute forced??]
//     goalID = req.body["goalID"];  //get all variables out of the form
//     goalAmount = req.body["goalAmount"];
//     goalProgress = req.body["goalProgress"];
//     goalName = req.body["goalName"];
//     goalSlider = req.body["goalSlider"];
//
//
//     correct = true;
//     if(!/^([A-Za-z]{1,15})$/.test(goalName)) {
//         res.render('Goals', {path: req.originalUrl});
//         return;
//     }
//
//     if(correct){
//         //update records
//         await accountModel.destroy({goalID: fName, lastName: lName, dob:dateb},{where:{userID:uid}});
//         res.redirect('/Dashboard');
//     }else{
//         res.render('Goals', {path: req.originalUrl});
//     }
// });

module.exports = router;  //This allows your router to be used in the main app file