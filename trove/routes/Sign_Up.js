var express = require('express');
var router = express.Router();
let accountModel = require('../db/Objects/account.js').Account;
/* GET Login page. */
router.get('*', function(req, res, next) {
    res.render('Sign-Up', {nmessage:""});
});
router.post('*', async function(req, res, next) {
    session = req.session
    FirstVal = req.body["Fname"]
    LastVal = req.body["Lname"]
    EmailVal = req.body['Email']
    NewPassVal = req.body['NewPsswd']
    CheckPassVaal = req.body['CheckPsswd']

    });
async function CheckPassword(NewPassVal,CheckPassVal){
    First =  await accountModel.findAll({
        where: {
            firstName: "Fname"
            lastName : "Lname"
            email: "Email"
            
        }
    })
}