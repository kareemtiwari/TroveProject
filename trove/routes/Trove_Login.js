var express = require('express');
var router = express.Router();
let accountModel = require('../db/Objects/account.js').Account;
/* GET Login page. */
router.get('*', function(req, res, next) {
    res.render('Trove_Login', {nmessage:""});
});
router.post('*', async function(req, res, next) {
    session = req.session;

    Userval = req.body["UsName"];
    Passval = req.body["Psswd"];

    name = await accountModel.findAll({
        where: {
            email: Userval
        },
        raw : true
    });

    getUsers = JSON.parse(JSON.stringify(name,null,2))[0];
     if(getUsers["password"] == Passval)
    {
        session.userID = getUsers["id"];
        //res.render('Trove_Login', {nmessage: "Welcome " + getUsers["firstName"]})
        res.redirect('/');
    }
     else{
         res.render('Trove_Login', {nmessage: "Passwords Do NOT Match"})
    }
});

module.exports = router;
