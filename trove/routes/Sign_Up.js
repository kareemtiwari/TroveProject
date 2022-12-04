var express = require('express');
var router = express.Router();
let accountModel = require('../db/Objects/account.js').Account;
/* GET Sign-Up page. */
router.get('*', function(req, res, next) {
    res.render('Sign-Up', {EmptyErr:"",FirstErr:"",LastErr:"",EmailErr:"",NewPassErr:"",CheckPassErr:"",FName:"",LName:"",ElectMail:"",NewPassword:"",CheckPassword:""});
});
router.post('*', async function(req, res, next) {
    let session = req.session

    let FirstVal = req.body["Fname"].replace(/\s/g, "");
    let LastVal = req.body["Lname"].replace(/\s/g, "");
    let EmailVal = req.body["Email"].replace(/\s/g, "");
    let NewPassVal = req.body["NewPsswd"].replace(/\s/g, "");
    let CheckPassVal = req.body["CheckPsswd"].replace(/\s/g, "");

    let error = false;
    let e_empty = "";
    let e_first = "";
    let e_last = "";
    let e_email = "";
    let e_npass = "";
    let e_checkpass = "";

    if(FirstVal ==  "" && LastVal == ""&& EmailVal == "" && NewPassVal == "" && CheckPassVal == "" ) {
        error = true;
        e_empty = "You have to fill out all forms, Nothing must be left empty";
    }

    if (FirstVal==""){
        error = true;
        e_first = "You have to fill out The First Name field";
    }

    if (LastVal ==""){
        error = true;
        e_last = "You have to fill out The Last Name field";
    }

    if (EmailVal==""){
        error = true;
        e_email = "You have to fill out The Email field";
    }

    if (NewPassVal==""){    //TODO : redundant test
        error = true;
        e_npass = "The New password value is too short. Needs to be a minimum of 12 characters.";
    }
    if(NewPassVal.length< 11){
        error = true;
        e_npass = "The New password value is too short. Needs to be a minimum of 12 characters.";
    }

    if(CheckPassVal !== NewPassVal){
        error = true;
        e_checkpass = "The Check password value need to match the New password value above";
    }
    if(CheckPassVal == ""){
        error = true;
        e_checkpass = "The Check password value cannot remain empty.Please enter the value that matches the password created above.";
    }

    if(error){
        res.render('Sign-Up', {EmptyErr:e_empty,FirstErr:e_first,LastErr:e_last,EmailErr:e_email,NewPassErr:e_npass,CheckPassErr:e_checkpass,FName:FirstVal,LName:LastVal,ElectMail:EmailVal,NewPassword:NewPassVal,CheckPassword:CheckPassVal});
    }else{
        let newuser = await accountModel.create({
            firstName: FirstVal,
            lastName: LastVal,
            email: EmailVal,
            password: NewPassVal,
            accComplete: false
        });
        session.userID = newuser.id;
        res.redirect('/accSettings')
        return;
    }


    console.log(NewPassVal,CheckPassVal);

});
module.exports = router;

