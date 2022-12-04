var express = require('express');
const {DbGoals: goalModel} = require("../db/Objects/dbGoals");
var router = express.Router();
let accountModel = require('../db/Objects/account.js').Account;   //NEEDED TO USE DATABASE OBJECT

let jobModel = require('../db/Objects/jobs.js').Jobs;   //NEEDED TO USE DATABASE OBJECT

let expendModel = require('../db/Objects/expenditures.js').Expenditures;

let eventsModel = require('../db/Objects/events.js').Events;



/**
 * GET router - this is what is called when this routers path is hit with an HTTP get request
 * This usually happens when a user navigated to your page, or refreshes the page
 */
router.get('/', async function(req, res, next) {
  if(req.session.userID != null) {

  let uid = req.session.userID;
  console.log("subm");

  let user = await qUser(uid);  //the first user in query - there should really only ever be 1
  let jd = await qJobs(uid);
    let expendQuery = await expendModel.findAll({
      where: {
        userID : uid
      },
      raw : true
    });
      let sdata = [];
    for(let i=0;i<expendQuery.length;i++){
      let curr = expendQuery[i];
      sdata[i] = [curr.name,curr.type,curr.category,curr.value];
    }
    let workingDob = user.dob;
    let date = [];
    if(workingDob != null) {
      date = workingDob.split(" ");
    }
res.render('AccountSettings', {remessage: '', fname:user.firstName,lname:user.lastName,salary:user.salary,salary_sel:isSalarySelected(user.payMode),hourly_sel:isHourlySelected(user.payMode),dob:date[0],expend:sdata,jd:jd}); //TODO : model doesn't have all  console.log(user.id);

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

    fEvent = req.body["formID"];
    switch(fEvent){
      case "ACC":
        await doACC(req, res);
        break;
      case "DEL":
        await doDEL(req, res);
        break;
      case "ADD":
        await doADD(req, res);
        break;
    }
  console.log(req.url);
  console.log(req.body);

  }else{
    res.redirect('/Trove_Login'); //If the user wants to access the index ,and they are not logged in- redirect to login
  }
});


async function doACC(req, res){
 let error = false;
    let errorMsg = "";

    let session = req.session;
    let uid = req.session.userID; //need to check if there is one - [also eventually need to check if they are being brute forced??]
    let fName = req.body["fname"].replace(/\s/g, "");  //get all variables out of the form
    let lName = req.body["lname"].replace(/\s/g, "");
    let dateb = req.body["dob"].replace(/\s/g, "");
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

    if(fName == ""||lName == ""){
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

    if(!error){
      //update records
      await accountModel.update({firstName: fName, lastName: lName, salary:"", payMode:"", dob:dateb, accComplete:true},{where:{id:uid}});
      //update expenditures
      let jd = await qJobs(uid);
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

    }else{
      let jd = await qJobs(uid);
      let expendQuery = await expendModel.findAll({
        where: {
          userID : uid
        },
        raw : true
      });
      let sdata = [];
      for(let i=0;i<expendQuery.length;i++){
        let curr = expendQuery[i];
        sdata[i] = [curr.name,curr.type,curr.category,curr.value];
      }
      res.render('AccountSettings', {remessage: errorMsg, fname:fName,lname:lName,salary:"",salary_sel:isSalarySelected(""),hourly_sel:isHourlySelected(""),dob:dateb,expend:sdata,jd:jd,expend:sdata});

    }
}

async function doADD(req, res){
  session = req.session;
  uid = req.session.userID; //need to check if there is one - [also eventually need to check if they are being brute forced??]
  let jID = req.body["jobID"];  //get all variables out of the form
  let jName = req.body["jobName"];
  let jType = req.body["jobType"];
  let jPay = req.body["jobPay"];
  let nJPay = parseInt(jPay);
  let validState = ["Salary","Hourly"];
  console.log(jID, jName, jType, jPay);

  let error = false;
  let emess = "";

  if(jName == null || jName.length <1 || jName.length > 25){
    error = true;
    emess += "You have an error in your job name, ";
  }

  if(isNaN(nJPay) || nJPay == null || nJPay <=0 ){
    error = true;
    emess += "You have an error in your job pay, ";
  }

  if(jType == null || (!validState.includes(jType))){
    error = true;
    emess += "You have an error in your job type, ";
  }


if(!error){
  newJob = await jobModel.create({userID: uid, jobID: jID, jobName: jName, jobType: jType, jobPay: nJPay});
  let jobQuery = await jobModel.findAll({raw:true});
  console.log(jobQuery);
  console.log("***Job***"+jID+" Created");

  let user = await qUser(uid);  //the first user in query - there should really only ever be 1
  let jd = await qJobs(uid);
  let workingDob = user.dob;
  let date = [];
  if(workingDob != null) {
    date = workingDob.split(" ");
  }
  let expendQuery = await expendModel.findAll({
    where: {
      userID : uid
    },
    raw : true
  });
  let sdata = [];
  for(let i=0;i<expendQuery.length;i++){
    let curr = expendQuery[i];
    sdata[i] = [curr.name,curr.type,curr.category,curr.value];
  }
  res.render('AccountSettings', {remessage: '', fname:user.firstName,lname:user.lastName,salary:user.salary,salary_sel:isSalarySelected(user.payMode),hourly_sel:isHourlySelected(user.payMode),dob:date[0],jd:jd,expend:sdata}); //TODO : model doesn't have all


  }else{
  //error

  let user = await qUser(uid);  //the first user in query - there should really only ever be 1
  let jd = await qJobs(uid);
  let workingDob = user.dob;
  let date = [];
  if(workingDob != null) {
    date = workingDob.split(" ");

  }
  let expendQuery = await expendModel.findAll({
    where: {
      userID : uid
    },
    raw : true
  });
  let sdata = [];
  for(let i=0;i<expendQuery.length;i++){
    let curr = expendQuery[i];
    sdata[i] = [curr.name,curr.type,curr.category,curr.value];
  }
  res.render('AccountSettings', {remessage: emess, fname:user.firstName,lname:user.lastName,salary:user.salary,salary_sel:isSalarySelected(user.payMode),hourly_sel:isHourlySelected(user.payMode),dob:date[0],jd:jd,expend:sdata}); //TODO : model doesn't have all

}
}

async function doDEL(req, res){
  session = req.session;
  uid = req.session.userID; //need to check if there is one - [also eventually need to check if they are being brute forced??]
  let jID = req.body["jobID"];  //get all variables out of the form

  removeJob = await jobModel.destroy({where: {userID: uid, jobID: jID}});
  let jobQuery = await jobModel.findAll({raw: true});
  console.log(jobQuery);
  console.log("***Job***" + jID + " Deleted");
  let eventsQuery = await eventsModel.findAll({where: {userID: uid, eventJob: jID}, raw : true});
  for(let i = 0; i < eventsQuery.length; i++) {
    await eventsModel.destroy({where: {userID: uid, eventID: eventsQuery[i].eventID}});
    console.log('*** Deleted ' + (i+1).toString() + ' Event(s)');
  }
  let user = await qUser(uid);  //the first user in query - there should really only ever be 1
  let jd = await qJobs(uid);
  let workingDob = user.dob;
  let date = [];
  if(workingDob != null) {
    date = workingDob.split(" ");
  }
  let expendQuery = await expendModel.findAll({
    where: {
      userID : uid
    },
    raw : true
  });
  let sdata = [];
  for(let i=0;i<expendQuery.length;i++){
    let curr = expendQuery[i];
    sdata[i] = [curr.name,curr.type,curr.category,curr.value];
  }
  res.render('AccountSettings', {remessage: "", fname:user.firstName,lname:user.lastName,salary:user.salary,salary_sel:isSalarySelected(user.payMode),hourly_sel:isHourlySelected(user.payMode),dob:date[0],jd:jd,expend:sdata}); //TODO : model doesn't have all

}

async function qUser(uid){
  let query = await accountModel.findAll({
    where: {
      id: uid
    },

    raw : true
  });
  return query[0];
}

async function qJobs(uid){
  let jobQuery = await jobModel.findAll({
    where: {
      userID: uid
    },
    raw : true
  });

  jd = [...Array(3)].map(e => Array(6).fill(""));
  for(let i =0; i<3;i++){
    jd[i]["has"] = jobQuery[i] != null;
    if(jd[i]["has"]) {
      jd[i]["jobID"] = jobQuery[i].jobID
      jd[i]["jobName"] = jobQuery[i].jobName;
      jd[i]["jobType"] = jobQuery[i].jobType;
      jd[i]["jobPay"] = jobQuery[i].jobPay;
    }
  }
  return jd;
}

async function formatDate(dob){

  return date;
}

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