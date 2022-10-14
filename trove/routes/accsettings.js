var express = require('express');
var router = express.Router();
let accountModel = require('../db/Objects/account.js').Account;   //NEEDED TO USE DATABASE OBJECT 

/* GET Login page. */
router.get('*', function(req, res, next) {
  resp = atob(req.url.substring(1));  //substring to ignore the slash at the beggining
  if(resp == 'error'){
    res.render('AccountSettings', {remessage : 'error' ,path: req.originalUrl});
  }else {
    res.render('AccountSettings', {remessage: 'Initial', path: req.originalUrl});
  }
  console.log(req.url);
});

router.post('*', function(req, res, next) {
  console.log(req.url);
  console.log(req.body);

  query();

  session=req.session;

  value1 = req.body["fname"];
  if(value1 == 'Hayden'){
    session.userID = value1;
    console.log("logged in");
  }
  resp = "error";
  if(value1.length > 0){          //logic here + [cookie?] + [url Encoding??]
    res.redirect('/Dashboard');
  }else{
    res.redirect('/accSettings/'+ Buffer.from(resp).toString('base64url'));
  }
});

async function query(){
  const users = await accountModel.findAll();
  console.log(JSON.stringify(users,null,2));
}

module.exports = router;