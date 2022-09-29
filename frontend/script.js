// Show Full Schedule Widget - Hide Main Display
function displayScheduleFull() {
  var hide = document.getElementById("mainDisplay");
  var show = document.getElementById("ScheduleFull");
  hide.style.display = "none";
  show.style.display = "flex";
}

// Show Full Budget Widget - Hide Main Display
function displayBudgetFull() {
  var hide = document.getElementById("mainDisplay");
  var show = document.getElementById("BudgetFull");
  hide.style.display = "none";
  show.style.display = "flex";
}

// Display Full Troves Widget - Hide Main Display
function displayTrovesFull() {
  var hide = document.getElementById("mainDisplay");
  var show = document.getElementById("TrovesFull");
  hide.style.display = "none";
  show.style.display = "flex";
}

// Show Main Display - Hide Full Schedule Widget
function hideScheduleFull() {
  var hide = document.getElementById("ScheduleFull");
  var show = document.getElementById("mainDisplay");
  hide.style.display = "none";
  show.style.display = "flex";
}

// Show Main Display - Hide Full Budget Widget
function hideBudgetFull() {
  var hide = document.getElementById("BudgetFull");
  var show = document.getElementById("mainDisplay");
  hide.style.display = "none";
  show.style.display = "flex";
}

// Show Main Display - Hide Full Troves Widget
function hideTrovesFull() {
  var hide = document.getElementById("TrovesFull");
  var show = document.getElementById("mainDisplay");
  hide.style.display = "none";
  show.style.display = "flex";
}

// Show Create Account After Sign Up Clicked
function showCreateAccount() {
  var hide = document.getElementById("Login");
  var show = document.getElementById("CreateAccount");
  hide.style.display = "none";
  show.style.display = "flex";
}

// Show Main Display After Accout Created
function confirmCreateAccount() {
  var hide = document.getElementById("CreateAccount");
  var show = document.getElementById("mainDisplay");
  var logout = document.getElementById("logOut");
  logout.style.display = "block";
  hide.style.display = "none";
  show.style.display = "flex";
}

// Show Main Display - Hide CreateAccount
function hideCreateAccount() {
  var hide = document.getElementById("CreateAccount");
  var show = document.getElementById("Login");
  hide.style.display = "none";
  show.style.display = "flex";
}

// Show Main Display After Login
function hideLogin() {
  var hide = document.getElementById("Login");
  var show = document.getElementById("mainDisplay");
  var logout = document.getElementById("logOut");
  logout.style.display = "block";
  hide.style.display = "none";
  show.style.display = "flex";
}

// Hide Main Display After Log Out
function showLogin() {
  var hide = document.getElementById("mainDisplay");
  var show = document.getElementById("Login");
  var logout = document.getElementById("logOut");
  logout.style.display = "none";
  hide.style.display = "none";
  show.style.display = "flex";
}

// Trove Home Button Clicked
function troveHome() {
  var schedule = document.getElementById("ScheduleFull");
  var budget = document.getElementById("BudgetFull");
  var troves = document.getElementById("TrovesFull");
  if (schedule.style.display == "flex") {
    hideScheduleFull();
  }
  else if (budget.style.display == "flex") {
    hideBudgetFull();
  }
  else if (troves.style.display == "flex") {
    hideTrovesFull();
  }
}
