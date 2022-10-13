var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/accSet', function(req, res, next) {
    console.log(req.body);
    session=req.session;
    value1 = req.body["fname"];
    if(value1 == 'Hayden'){
        session.userID = value1;
        console.log("logged in");
    }
    resp = "error";
    if(value1.length > 0){          //logic here + [cookie?] + [url Encoding??]
        res.redirect('/Dashboard.html');
    }else{
        res.redirect('/accSettings/'+Buffer.from(resp).toString('base64url'));
    }

});

module.exports = router;
