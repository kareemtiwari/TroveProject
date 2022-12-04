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

    let Userval = req.body["UsName"];
    let Passval = req.body["Psswd"];

    let name = await accountModel.findAll({
        where: {
            email: Userval
        },
        raw: true
    });

    let getUsers = JSON.parse(JSON.stringify(name, null, 2))[0];
    let hashedTry = crypto.createHash('md5').update(Passval).digest('hex');
    if (getUsers["password"] === hashedTry) {

        session.userID = getUsers["id"];
        session.accComplete = getUsers["accComplete"];
        //res.render('Trove_Login', {nmessage: "Welcome " + getUsers["firstName"]})
        if (getUsers["accComplete"]) {
            res.redirect('/');
        } else {
            res.redirect('/accSettings');
        }

    } else {
        res.render('Trove_Login', {nmessage: "Passwords Do NOT Match"})
    }
});


module.exports = router;
