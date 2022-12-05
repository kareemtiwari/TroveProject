const express = require('express');

const crypto = require("crypto");

const router = express.Router();
const accountModel = require('../db/Objects/account.js').Account;

/* GET Login page. */

router.get('*', function (req, res, next) {
    res.status(200);
    res.render('Trove_Login', {nmessage: ""});

});
router.post('*', async function (req, res, next) {
    let session = req.session;

    let error = false;
    let message = "";

    let Userval = req.body["UsName"].replace(/\s/g, "");
    let Passval = req.body["Psswd"].replace(/\s/g, "");

    if(!Userval.length>=1){
        error = true;
        message = "you must enter a username";
    }

    if(!Passval.length>=1){
        error = true;
        message = "you must enter a password";
    }

    if(Userval.length>=30){
        error = true;
        message = "username is incorrect";
    }else

    if(Passval.length>=30){
        error = true;
        message = "Incorrect Password";
    }

    let getUsers;

    if(!error) {
        let name = await accountModel.findAll({
            where: {
                email: Userval
            },
            raw: true
        });
        if(name.length>0) {

            getUsers = JSON.parse(JSON.stringify(name, null, 2))[0];
            let hashedTry = crypto.createHash('md5').update(Passval).digest('hex');
            if (getUsers["password"] === hashedTry) {

                session.userID = getUsers["id"];
                session.accComplete = getUsers["accComplete"];

            } else {
                error = true;
                message = "Incorrect Password";
            }
        }else{
            error = true;
            message = "Username not found"
        }
    }

    if(error) {
        res.render('Trove_Login', {nmessage: message})
    }else{
        if (getUsers["accComplete"]) {
            res.redirect('/');
        } else {
            res.redirect('/accSettings');
        }
    }
});


module.exports = router;
