/**
 * Open the setting menu.
 */
document.getElementsByClassName("bi bi-gear")[0].addEventListener("click", () => {
  // When the setting menu is closed
  if(document.getElementById("mySidepanel").style.width === "0px") {
    document.getElementById("mySidepanel").style.width = "500px";
    // Deactivate the textarea
    document.getElementById("contentArea").style.pointerEvents = "none";
    document.getElementById("editor").style.pointerEvents = "none";
    document.getElementById("settingIcon").style.transform = "rotate(180deg)";
    // Activate the "click somewhere else to close the window" function
    document.getElementById("blocker").style.pointerEvents = "all";
    document.getElementById("blocker").style.zIndex = "29";
    console.log("Executing action");
    // When the setting menu is opened
  }else if(document.getElementById("mySidepanel").style.width !== "0px") {
    document.getElementById("mySidepanel").style.width = "0";
    // Activate textarea
    document.getElementById("contentArea").style.pointerEvents = "all";
    document.getElementById("editor").style.pointerEvents = "all";
    document.getElementById("settingIcon").style.transform = "rotate(0deg)";
    // Deactivate "click somewhere else" function
    document.getElementById("blocker").style.pointerEvents = "none";
    document.getElementById("blocker").style.zIndex = "-2";
    console.log("Executing action");
  }
});

/**
 * Click somewhere else on the screen to close the windows, including the dateSelector and setting menu.
 */
document.getElementById("blocker").addEventListener("click", () => {
  document.getElementById("mySidepanel").style.width = "0";
  document.getElementById("contentArea").style.pointerEvents = "all";
  document.getElementById("editor").style.pointerEvents = "all";
  document.getElementById("settingIcon").style.transform = "rotate(0deg)";
  // Deactivate this function until revisited
  document.getElementById("blocker").style.pointerEvents = "none";
  document.getElementById("blocker").style.zIndex = "-2";
  document.getElementById("dateSelector").style.marginLeft = "-210px";
  document.getElementById("selectorExpBlock").style.left = "210px";
  document.getElementById("selectorExp").style.transform = "rotate(0deg)";
  console.log("Executing action");
});

/ Set the preset value of the first expansion
document.getElementById("additionFirstExp").style.height = "0";

/**
 * Click on the plus button on the right bottom side to access more functions, including voice-memo and webcam
 */
document.getElementsByClassName("bi bi-plus-circle")[0].addEventListener("click", () => {
  // When the First Expansion is expanded
  if(document.getElementById("additionFirstExp").style.height !== "0px") {
    document.getElementById("additionThreeDots").style.transform = "rotate(0deg)";
    document.getElementById("additionFirstExp").style.height = "0";
    document.getElementById("additionMicrophone").style.height = "0";
    document.getElementById("additionMicrophoneClose").style.opacity = "0";
    document.getElementById("additionCamera").style.height = "0";
    document.getElementById("additionMicrophone").style.opacity = "0";
    document.getElementById("additionCamera").style.opacity = "0";
  // When the First Expansion is not expanded
  }else if(document.getElementById("additionFirstExp").style.height === "0px") {
    document.getElementById("additionThreeDots").style.transform = "rotate(45deg)";
    document.getElementById("additionFirstExp").style.height = "116px";
    document.getElementById("additionMicrophone").style.height = "36px";
    document.getElementById("additionCamera").style.height = "36px";
    document.getElementById("additionMicrophone").style.opacity = "100%";
    document.getElementById("additionCamera").style.opacity = "100%";
    document.getElementById("additionCamera").style.pointerEvents = "all";
  }
  // Close the Second Expansion when it's not closed
  if(document.getElementById("additionSecondExp").style.width !== "0px") {
    document.getElementById("additionSecondExp").style.width = "0";
    document.getElementById("additionRecordStart").style.opacity = "0";
    document.getElementById("additionRecordStop").style.opacity = "0";
    document.getElementById("additionMicrophoneClose").style.opacity = "0";
    document.getElementById("additionRecordStart").style.pointerEvents = "none";
    document.getElementById("additionRecordStop").style.pointerEvents = "none";
  }
  if(document.getElementById("audio-element")){
    document.getElementById("audio-element").style.zIndex = "15";
  }
  console.log("Executing action");
});

/**
 * Expand the Second Expansion, the voice-memo function, after clicking the microphone button
 */
document.getElementsByClassName("bi bi-mic")[0].addEventListener("click", () => {
  // When the Second Expansion is not closed
  if(document.getElementById("additionSecondExp").style.width !== "0px") {
    document.getElementById("additionSecondExp").style.width = "0";
    document.getElementById("additionRecordStart").style.opacity = "0";
    document.getElementById("additionRecordStop").style.opacity = "0";
    document.getElementById("additionCamera").style.opacity = "100%";
    document.getElementById("additionCamera").style.pointerEvents = "all";
  // When the Second Expansion is closed
  }else if(document.getElementById("additionSecondExp").style.width === "0px") {
    document.getElementById("additionSecondExp").style.width = "56px";
    document.getElementById("additionRecordStart").style.opacity = "100%";
    document.getElementById("additionCamera").style.opacity = "0";
    document.getElementById("additionCamera").style.pointerEvents = "none";
    document.getElementById("additionRecordStart").style.pointerEvents = "all";
  }
  console.log("Executing action");
});

/**
 * Click the record start and switch to the record stop button
 */
document.getElementsByClassName("bi bi-record-circle")[0].addEventListener("click", () => {
  document.getElementById("additionRecordStart").style.opacity = "0";
  document.getElementById("additionRecordStop").style.opacity = "100%";
  document.getElementById("additionRecordStop").style.pointerEvents = "all";
  document.getElementById("additionRecordStart").style.pointerEvents = "none";
  document.getElementById("additionMicrophoneClose").style.pointerEvents = "none";
  document.getElementById("additionMicrophone").style.pointerEvents = "none";
  document.getElementById("additionThreeDots").style.pointerEvents = "none";
  document.getElementById("sec").style.opacity = "100";
  // Start the timer
  timer();
  console.log("Executing action");
});

/**
 * Click the stop recording button and switch to the start recording button
 */
document.getElementsByClassName("bi bi-stop-circle")[0].addEventListener("click", () => {
  document.getElementById("additionRecordStop").style.opacity = "0";
  document.getElementById("additionRecordStart").style.opacity = "100%";
  document.getElementById("additionRecordStart").style.pointerEvents = "all";
  document.getElementById("additionRecordStop").style.pointerEvents = "none";
  document.getElementById("additionMicrophoneClose").style.pointerEvents = "all";
  document.getElementById("additionMicrophone").style.pointerEvents = "all";
  document.getElementById("additionThreeDots").style.pointerEvents = "all";
  document.getElementById("sec").style.opacity = "0";
  console.log("Executing action");
});

/**
 * Click the dateSelector Expand button to expand the dateSelector
 */
document.getElementById("selectorExpBlock").addEventListener("click", () => {
  // When the dateSelector is not expanded
  if(document.getElementById("dateSelector").style.marginLeft === "-210px") {
    document.getElementById("dateSelector").style.marginLeft = "0px";
    document.getElementById("selectorExpBlock").style.left = "210px";
    // Activate the blocker
    document.getElementById("selectorExp").style.transform = "rotate(180deg)";
    document.getElementById("blocker").style.pointerEvents = "all";
    document.getElementById("blocker").style.zIndex = "29";
  // When the dateSelector is expanded
  }else {
    document.getElementById("dateSelector").style.marginLeft = "-210px";
    document.getElementById("selectorExpBlock").style.left = "210px";
    document.getElementById("selectorExp").style.transform = "rotate(0deg)";
    // Deactivate the blocker
    document.getElementById("blocker").style.zIndex = "-2";
    document.getElementById("blocker").style.pointerEvents = "none";
  }
});

// Give the preset value of dateSelector margin
document.getElementById("dateSelector").style.marginLeft = "0px";

// Show the dateSelector when the page is refreshed to remind the user the place of dateSelector
setTimeout(function() {
  document.getElementById("dateSelector").style.marginLeft = "-210px";
}, 750);

/**
 * The basic function of timer.
 * @constructor
 */
function timer() {
  console.log("start timing");
  createTimerText(0);
  var start = Date.now();
  var myTimer = setInterval(function oneTimer() {
    var delta = Date.now() - start; // milliseconds elapsed since start
    createTimerText(Math.floor(delta / 1000)); // in seconds
  }, 1000);
  document.getElementsByClassName("bi bi-stop-circle")[0].addEventListener("click", () => {
    clearInterval(myTimer);
    console.log("stop timing");
    deleteTimerText();
  });
}

// Get the place to insert the timer
var timerBlock = document.getElementById("timerBlock");

/**
 * Create the text of timer and delete the older text.
 * @param time the value that needs to be printed
 */
function createTimerText(time) {
  if(document.getElementById("timer")) {
    deleteTimerText();
  }
  var timerText = document.createElement("p");
  timerText.id = "timer";
  timerText.innerText = time.toString();
  timerBlock.appendChild(timerText);
}

/**
 * Delete the older version of the time printed.
 */
function deleteTimerText() {
  var timerText = document.getElementById("timer");
  timerBlock.removeChild(timerText);
}
