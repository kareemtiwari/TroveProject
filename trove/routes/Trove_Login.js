var express = require('express');
var router = express.Router();
let accountModel = require('../db/Objects/account.js').Account;
/* GET Login page. */
router.get('/', function(req, res, next) {
    res.render('Trove_Login', { title: 'Express' ,path: req.originalUrl});
});
router.post('*', function(req, res, next) {

    Userval = req.body["UsName"]
    Passval = req.body["Psswd"]
    geUser = getByUserName(Userval)
     if(getUser["password"] === Passval)
    {

        res.render('Trove_Login', {nmessage: "Welcome" + accountModel.getAttributes("firstName")})
    }
     else{
         res.render('Trove_Login', {nmessage: "Passwords Do NOT Match"})
    }


});

async function getByUserName(email){
    name = await accountModel.findAll({
       where: {
           email: "UsName"
       }

})



}
module.exports = router;
