var express = require('express');
const {Account: accountModel} = require("../db/Objects/account");
var router = express.Router();

/* GET Login page. */
router.get('*', async function(req, res, next) {
        if(req.session.userID != null) {
                session = req.session;
        uid = session.userID;
        let query = await accountModel.findAll({
                where: {
                        id: uid
                },
                raw : true
        });
        let user = query[0];
        res.render('Dashboard', {userid: user.firstName});
        }else{
                res.redirect('/Trove_Login'); //If the user wants to access the index ,and they are not logged in- redirect to login
        }
});

module.exports = router;
