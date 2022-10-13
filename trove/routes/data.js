var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/accSet', function(req, res, next) {
    console.log(req.body);
    value1 = req.body["fname"];
    if(value1.includes('@',1)){          //logic here + [cookie?] + [url Encoding??]
        res.redirect('/accSettings/pos');
    }else{
        res.redirect('/accSettings/neg');
    }

});

module.exports = router;
