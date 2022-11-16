var express = require('express');
var router = express.Router();
let accountModel = require('../db/Objects/account.js').Account;   //NEEDED TO USE DATABASE OBJECT
let expendModel = require('../db/Objects/expenditures.js').Expenditures;


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
    let expendQuery = await expendModel.findAll({
      where: {
        userID : uid
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
    let sdata = [];
    for(let i=0;i<expendQuery.length;i++){
      let curr = expendQuery[i];
      sdata[i] = [curr.name,curr.type,curr.category,curr.value];
    }
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

    let error = false;
    let errorMsg = "";

    let session = req.session;
    let uid = req.session.userID; //need to check if there is one - [also eventually need to check if they are being brute forced??]
    let fName = req.body["fname"];  //get all variables out of the form
    let lName = req.body["lname"];
    let sal = req.body["salary"];
    let mode = req.body["salhour"];
    let dateb = req.body["dob"];
    let expSize = req.body["expendSize"];

    //expenditures processing
    let sdata = [];
    for(let i = 0;i<expSize;i++){
      sdata[i] = [req.body["expend["+i+"][0]"],req.body["expend["+i+"][1]"],req.body["expend["+i+"][2]"],req.body["expend["+i+"][3]"]];
    }

    let validTypes = ["Fixed","Variable"];
    let validCategories = ["Housing","Transportation","Food","Education","Entertainment","Miscellaneous"];

    //expenditures type checking
    for(let i = 0;i<sdata.length;i++){
      let a = sdata[i];
      let numForm = "th";
      if(i==0){
        numForm = "st";
      }
      if(i==1){
        numForm = "nd";
      }
      if(i==2){
        numForm = "rd";
      }
      if(a[0].length >25) {
        error = true;
        errorMsg += "Your " + (i+1) + numForm + " expenditure has an incorrect name, ";
      }
      if(!/^[\d]{1,7}$/.test(a[3])) {
        error = true;
        errorMsg += "Your " + (i+1) + numForm + " expenditure has an incorrect amount, ";
      }
      if(!validTypes.includes(a[1])){
        error = true;
        errorMsg += "Your " + (i+1) + numForm + " expenditure has an incorrect type, ";
      }
      if(!validCategories.includes(a[2])){
        error = true;
        errorMsg += "Your " + (i+1) + numForm + " expenditure has an incorrect category, ";
      }
    }

    console.log(sdata);

    if(fName == ""||lName == ""||sal== ""){
      error = true;
      errorMsg += "You Have to fill out Everything, ";
    }

    if(!/^([A-Za-z]{1,10})$/.test(fName)) {
      error = true;
      errorMsg += "First Name is wrong, ";
    }

    if(!/^([A-Za-z]{1,10})$/.test(lName)) {
      error = true;
      errorMsg += "Last Name is wrong, ";
    }

    if(dateb == '' || dateb == null){
      error = true;
      errorMsg += "Date is Empty, ";
    }

    if(sal <= 0){
      error = true;
      errorMsg += "you must make over $0, ";
    }

    if(mode == null || mode == ''){
      error = true;
      errorMsg += "you need to select salary or hourly, ";
    }

    if(!error){
      //update records
      await accountModel.update({firstName: fName, lastName: lName, salary:sal, payMode:mode, dob:dateb, accComplete:true},{where:{id:uid}});
      //update expenditures
      let expendQuery = await expendModel.destroy({
        where: {
          userID : uid
        },
        raw : true
      });
      for(let i = 0;i<sdata.length;i++){
        await expendModel.create({userID: uid, value : sdata[i][3], type : sdata[i][1], category: sdata[i][2], name: sdata[i][0]});
      }
      session.accComplete = true;
      res.redirect('/Dashboard');
      return;
    }else{
      res.render('AccountSettings', {remessage: errorMsg, fname:fName,lname:lName,salary:sal,salary_sel:isSalarySelected(mode),hourly_sel:isHourlySelected(mode),dob:dateb,expend:sdata});
      return;
    }
  }else{
    res.redirect('/Trove_Login'); //If the user wants to access the index ,and they are not logged in- redirect to login
    return;
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