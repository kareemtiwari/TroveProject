var express = require('express');
const {Account: accountModel} = require('../db/Objects/account');
var router = express.Router(); //NEEDED TO USE DATABASE OBJECT
let goalModel = require('../db/Objects/dbGoals.js').DbGoals;   //NEEDED TO USE DATABASE OBJECT

/**
 * GET router - this is what is called when this routers path is hit with an HTTP get request
 * This usually happens when a user navigated to your page, or refreshes the page
 */
router.get('*',  async function(req, res, next) {
    let uid = req.session.userID;
    //TODO : have to check if there is a userID in the session
    //get the currently logged in user
    let query = await goalModel.findAll({
        where: {
            id: 1 //was uid
        },
        raw : true
    });
    let user = query[0];  //the first user in query - there should really only ever be 1
    // //TODO : have to check if there is a user
    res.render('Goals', {path: req.originalUrl}); //TODO : model doesn't have all
    // console.log(user.id);
});

/**
 * POST router - this is what is called when this routers path is hit with an HTTP post request
 * This usually happens when a user has clicked submit on a form, or is otherwise sending data to your site
 */
router.post('*', async function(req, res, next) {
    console.log(req.url);
    console.log(req.body);

    session = req.session;
    uid = req.session.userID; //need to check if there is one - [also eventually need to check if they are being brute forced??]
    let gID = req.body["goalID"];  //get all variables out of the form

    let gAmount = req.body["goalAmount"];
    gAmount = parseInt(gAmount);
    var gProgress = req.body["goalProgress"];
    gProgress = parseInt(gProgress);
    var gName = req.body["goalName"];
    var gSlider = req.body["goalSlider"];


    // correct = true;
    // if(!/^([A-Za-z]{1,15})$/.test(goalName)) {
    //     res.render('Goals', {remessage: 'Goal Name must be 1-15 Letters only', path: req.originalUrl});
    //     return;
    // }
    newGoal = goalModel.create({userID: 1, goalID: gID, goalAmount: gAmount, goalProgress: 10, goalName: "car",goalSlider: 50});
        let query = await goalModel.findAll({raw:true});
        console.log(query);
        console.log("***Goal***"+gAmount+" Created");
    //,{where:{userID:uid}}
        //res.redirect('/Dashboard');
    //}else{
        res.render('Goals', {
            path: req.originalUrl});
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