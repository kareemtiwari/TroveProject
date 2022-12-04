var express = require('express');
var router = express.Router();
let accountModel = require('../db/Objects/account.js').Account;
/* GET Sign-Up page. */
router.get('*', function(req, res, next) {
    res.render('Sign-Up', {EmptyErr:"",FirstErr:"",LastErr:"",EmailErr:"",NewPassErr:"",CheckPassErr:"" });
});
router.post('*', async function(req, res, next) {
    session = req.session
    if(FirstVal ==  "" && LastVal == ""&& EmailVal == "" && NewPassVal == "" && CheckPassVal == "" ) {
        res.render('Sign-Up', {EmptyErr: 'You have to fill out all forms, Nothing must be left empty', FName:FirstVal,LName:LastVal,ElectMail:EmailVal,NewPassword:NewPassVal,CheckPassword:CheckPassVal});
    }
    FirstVal = req.body["Fname"];
    if (FirstVal==""){
        res.render('Sign-Up', {FirstErr: 'You have to fill out The First Name field', FName:FirstVal,LName:LastVal,ElectMail:EmailVal,NewPassword:NewPassVal,CheckPassword:CheckPassVal});
    }
    LastVal = req.body["Lname"];
    if (LastVal ==""){
        res.render('Sign-Up', {LastErr: 'You have to fill out The Last Name field', FName:FirstVal,LName:LastVal,ElectMail:EmailVal,NewPassword:NewPassVal,CheckPassword:CheckPassVal});

    }
    EmailVal = req.body["Email"];
    if (EmailVal==""){
        res.render('Sign-Up', {EmailErr: 'You have to fill out The Email field', FName:FirstVal,LName:LastVal,ElectMail:EmailVal,NewPassword:NewPassVal,CheckPassword:CheckPassVal});

    }
    NewPassVal = req.body["NewPsswd"];
    if (NewPassVal==""){
        res.render('Sign-Up', {NewPassErr: 'You have to fill out The New Password field', FName:FirstVal,LName:LastVal,ElectMail:EmailVal,NewPassword:NewPassVal,CheckPassword:CheckPassVal});

    }
    if(length(NewPassVal)< 11){
        res.render('Sign-Up', {NewPassErr: "The New password value is too short. Needs to be a minimum of 12 characters.", FName:FirstVal,LName:LastVal,ElectMail:EmailVal,NewPassword:NewPassVal,CheckPassword:CheckPassVal});

    }
    CheckPassVal = req.body["CheckPsswd"];
    if(CheckPassVal !== NewPassVal){
        res.render('Sign-Up', {CheckPassErr: "The Check password value need to match the New password value above", FName:FirstVal,LName:LastVal,ElectMail:EmailVal,NewPassword:NewPassVal,CheckPassword:CheckPassVal});
    }
    if(CheckPassVal == ""){
        res.render('Sign-Up', {CheckPassErr: "The Check password value cannot remain empty.Please enter the value that matches the password created above.", FName:FirstVal,LName:LastVal,ElectMail:EmailVal,NewPassword:NewPassVal,CheckPassword:CheckPassVal});
    }



    console.log(NewPassVal,CheckPassVal);

});
module.exports = router;

