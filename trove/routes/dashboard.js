var express = require('express');
var router = express.Router();

/* GET Login page. */
router.get('*', function(req, res, next) {
        session = req.session;
        res.render('Dashboard', {userid: session.userID});
});

module.exports = router;
