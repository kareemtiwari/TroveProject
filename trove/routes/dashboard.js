var express = require('express');
const {Account: accountModel} = require("../db/Objects/account");
var router = express.Router();

/* GET Login page. */
router.get('*', async function(req, res, next) {
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
});

module.exports = router;
