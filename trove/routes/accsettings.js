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
    var workingDob = user.dob;
    date = [];
    if(workingDob != null) {
      date = workingDob.split(" ");
    }
    let sdata = [["Car","Fixed","Transportation",4],["House","Fixed","Hosuing",120]];
    res.render('AccountSettings', {remessage: '', fname:user.firstName,lname:user.lastName,salary:user.salary,salary_sel:isSalarySelected(user.payMode),hourly_sel:isHourlySelected(user.payMode),dob:date[0],expend:sdata}); //TODO : model doesn't have all
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
    let sdata = [["Car","Fixed","Transportation",4],["House","Fixed","Hosuing",120]];

    correct = true;
    if(fName == ""||lName == ""||sal== ""){
      res.render('AccountSettings', {remessage: 'You have to fill out all fields', fname:fName,lname:lName,salary:sal,salary_sel:isSalarySelected(mode),hourly_sel:isHourlySelected(mode),dob:dateb,expend:sdata});
      return;
    }

    if(!/^([A-Za-z]{1,10})$/.test(fName)) {
      res.render('AccountSettings', {remessage: 'First name is formatted wrong', fname:fName,lname:lName,salary:sal,salary_sel:isSalarySelected(mode),hourly_sel:isHourlySelected(mode),dob:dateb,expend:sdata});
      return;
    }

    if(!/^([A-Za-z]{1,10})$/.test(lName)) {
      res.render('AccountSettings', {remessage: 'Last name is formatted wrong', fname:fName,lname:lName,salary:sal,salary_sel:isSalarySelected(mode),hourly_sel:isHourlySelected(mode),dob:dateb,expend:sdata});
      return;
    }

    if(dateb == '' || dateb == null){
      res.render('AccountSettings', {remessage: 'Date is empty', fname:fName,lname:lName,salary:sal,salary_sel:isSalarySelected(mode),hourly_sel:isHourlySelected(mode),dob:dateb,expend:sdata});
      return;
    }

    if(sal <= 0){
      res.render('AccountSettings', {remessage: 'You cant make $0 or less', fname:fName,lname:lName,salary:sal,salary_sel:isSalarySelected(mode),hourly_sel:isHourlySelected(mode),dob:dateb,expend:sdata});
      return;
    }

    if(mode == null || mode == ''){
      res.render('AccountSettings', {remessage: 'You need to select salary or hourly', fname:fName,lname:lName,salary:sal,salary_sel:isSalarySelected(mode),hourly_sel:isHourlySelected(mode),dob:dateb,expend:sdata});
      return;
    }

    if(correct){
      //update records
      await accountModel.update({firstName: fName, lastName: lName, salary:sal, payMode:mode, dob:dateb, accComplete:true},{where:{id:uid}});
      session.accComplete = true;
      res.redirect('/Dashboard');
    }else{
      res.render('AccountSettings', {remessage: 'Input Error', fname:fName,lname:lName,salary:sal,salary_sel:isSalarySelected(mode),hourly_sel:isHourlySelected(mode),dob:dateb,expend:sdata});
    }
  }else{
    res.redirect('/Trove_Login'); //If the user wants to access the index ,and they are not logged in- redirect to login
  }
});

function isSalarySelected(mode){
  if(mode == "Salary"){
    return "checked";
  }
  return "";
}

function isHourlySelected(mode){
  if(mode == "Hourly"){
    return "checked";
  }
  return "";
}

class AccountSettings {

  /**
   * The constructor - Database will instantiate
   * @param login object
   */
  constructor(login) {
    this.userID = login.userID;
    this.sessionID = login.sessionID;
    this.firstName = "from db";
    this.lastName = "from db";
    this.email = "from db";
    //password and secuirty question not instantiated
    this.expenditures = 0; //get from database or user input later (should be a table)
    this.wageInfo = 0; //get from database or user input later
  }

  /**
   * Getter for userID
   * @returns {*}
   */
  get userID() {              //example function
    return this.userID;
  }

  /**
   * Getter for expenditures
   * @returns {*}
   */
  get Expenditures() {            //example getter
    return this.expenditures;
  }

  /**
   * Getter for wage info
   * @returns {*}
   */
  get WageInfo() {
    return this.wageInfo;
  }
}



module.exports = router;  //This allows your router to be used in the main app file