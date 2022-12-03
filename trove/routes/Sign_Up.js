const express = require('express');
const router = express.Router();
const accountModel = require('../db/Objects/account.js').Account;
/* GET Sign-Up page. */
router.get('*', function (req, res, next) {
    res.render('Sign-Up', {nmessage: ""});
});
router.post('*', async function (req, res, next) {
    let session = req.session
    let FirstVal = req.body["Fname"];
    let LastVal = req.body["Lname"];
    let EmailVal = req.body["Email"];
    let NewPassVal = req.body["NewPsswd"];
    let CheckPassVal = req.body["CheckPsswd"];
    if (FirstVal !== "" && LastVal !== "" && EmailVal !== "" && NewPassVal !== "" && CheckPassVal !== "") {
        if (CheckPassVal === NewPassVal) {
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

    }

    console.log(NewPassVal, CheckPassVal);
    res.render('Sign-Up', {nmessage: "Error"});

});
module.exports = router;

