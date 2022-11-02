var express = require('express');
var router = express.Router();
let accountModel = require('../db/Objects/account.js').Account;   //NEEDED TO USE DATABASE OBJECT

/**
 * GET router - this is what is called when this routers path is hit with an HTTP get request
 * This usually happens when a user navigated to your page, or refreshes the page
 */
router.get('/', async function(req, res, next) {
  if(req.session.userID != null) {
  let uid = req.session.userID;
  //TODO : have to check if there is a userID in the session
  //get the currently logged in user
  let query = await accountModel.findAll({
    where: {
      id: uid
    },
    raw : true
  });
  let user = query[0];  //the first user in query - there should really only ever be 1
  //TODO : have to check if there is a user
  res.render('AccountSettings', {remessage: '', fname:user.firstName,lname:user.lastName,salary:"0",salary_sel:"checked",hourly_sel:"",dob:user.dob}); //TODO : model doesn't have all
  console.log(user.id);
  }else{
    res.redirect('/Trove_Login'); //If the user wants to access the index ,and they are not logged in- redirect to login
  }
});

router.get('/logout', async function(req, res, next) {
  req.session.userID = null;
  res.redirect('/Trove_Login');
});

/**
 * POST router - this is what is called when this routers path is hit with an HTTP post request
 * This usually happens when a user has clicked submit on a form, or is otherwise sending data to your site
 */
router.post('*', async function(req, res, next) {
  if(req.session.userID != null) {
  console.log(req.url);
  console.log(req.body);

  session = req.session;
  uid = req.session.userID; //need to check if there is one - [also eventually need to check if they are being brute forced??]
  fName = req.body["fname"];  //get all variables out of the form
  lName = req.body["lname"];
  sal = req.body["salary"];
  mode = req.body["salhour"];
  dateb = req.body["dob"];

  correct = true;
  if(fName == ""||lName == ""||sal== ""){
    res.render('AccountSettings', {remessage: 'You have to fill out all fields', fname:fName,lname:lName,salary:"0",salary_sel:"checked",hourly_sel:"",dob:dateb});
    return;
  }

  if(!/^([A-Za-z]{1,10})$/.test(fName)) {
    res.render('AccountSettings', {remessage: 'First name is formatted wrong', fname:fName,lname:lName,salary:"0",salary_sel:"checked",hourly_sel:"",dob:dateb});
    return;
  }

  if(!/^([A-Za-z]{1,10})$/.test(lName)) {
    res.render('AccountSettings', {remessage: 'Last name is formatted wrong', fname:fName,lname:lName,salary:"0",salary_sel:"checked",hourly_sel:"",dob:dateb});
    return;
  }

  if(correct){
    //update records
    await accountModel.update({firstName: fName, lastName: lName, dob:dateb, accComplete:true},{where:{id:uid}});
    session.accComplete = true;
    res.redirect('/Dashboard');
  }else{
    res.render('AccountSettings', {remessage: 'Input Error', fname:fName,lname:lName,salary:"0",salary_sel:"checked",hourly_sel:"",dob:dateb});
  }
  }else{
    res.redirect('/Trove_Login'); //If the user wants to access the index ,and they are not logged in- redirect to login
  }
});

module.exports = router;  //This allows your router to be used in the main app file