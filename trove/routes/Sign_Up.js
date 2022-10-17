var express = require('express');
var router = express.Router();
let accountModel = require('../db/Objects/account.js').Account;
/* GET Sign-Up page. */
router.get('*', function(req, res, next) {
    res.render('Sign-Up', {nmessage:""});
});
router.post('*', async function(req, res, next) {
    session = req.session
    FirstVal = req.body["Fname"];
    LastVal = req.body["Lname"];
    EmailVal = req.body["Email"];
    NewPassVal = req.body["NewPsswd"];
    CheckPassVal = req.body["CheckPsswd"];
    if(FirstVal !==  "" && LastVal !== ""&& EmailVal !== "" && NewPassVal !== "" && CheckPassVal !== "" ){
        if(CheckPassVal === NewPassVal){
            await accountModel.create({firstName:FirstVal, lastName:LastVal, email:EmailVal, password:NewPassVal});
            res.redirect('/accSettings')
            return;
        }

    }

    console.log(NewPassVal,CheckPassVal);
    res.render('Sign-Up', {nmessage:"Error"});

});
module.exports = router;

