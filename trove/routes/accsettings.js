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

  session = req.session;
  uid = req.session.id; //need to check if there is one - [also eventually need to check if they are being brute forced??]
  firstName = req.body["fname"];
  lastName = req.body["lname"];
  salary = req.body["salary"];
  mode = req.body["salhour"];
  dob = req.body["dob"];

  correct = true;
  if(!/^([A-Za-z]{1,15})$/.test(firstName)) {
    res.render('AccountSettings', {remessage: 'First Name must be 1-15 Letters only', path: req.originalUrl});
    return;
  }


  resp = "error";
  if(correct){          //logic here + [cookie?] + [url Encoding??]
    res.redirect('/Dashboard');
  }else{
    res.redirect('/accSettings/'+ Buffer.from(resp).toString('base64url'));
  }
});

async function getByUserID(userid){
  users = await accountModel.findAll({
    where: {
      id: userid
    }
  });
  console.log(JSON.stringify(users,null,2));
  return JSON.parse(users);
}

module.exports = router;