var express = require('express');
var router = express.Router();
let accountModel = require('../db/Objects/account.js').Account;
/* GET Sign-Up page. */
router.get('*', function(req, res, next) {
    res.render('Sign-Up', {nmessage:""});
});
router.post('*', async function(req, res, next) {
    session = req.session
    FirstVal = req.body["Fname"]
    LastVal = req.body["Lname"]
    EmailVal = req.body['Email']
    NewPassVal = req.body['NewPsswd']
    CheckPassVal = req.body['CheckPsswd']
    if(FirstVal !==  "" && LastVal !== ""&& EmailVal !== "" && NewPassVal !== "" && CheckPassVal !== "" && CheckPassVal === NewPassVal){
        await accountModel.create({firstname:FirstVal, lastName:LastVal, Email:EmailVal, password:NewPassVal});
        res.redirect('/accSettings')


    }


});
module.exports = router;

