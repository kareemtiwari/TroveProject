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
