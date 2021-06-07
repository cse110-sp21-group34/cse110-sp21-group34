// 
// function openNav() {
//     document.getElementById("mySidepanel").style.width = "250px";
//     console.log("Executing action");
//   }
  
//   
//   function closeNav() {
//     document.getElementById("mySidepanel").style.width = "0";
//   }

/* Set the width of the sidebar to 250px (show it) */
document.getElementsByClassName("bi bi-gear")[0].addEventListener("click", () => {
  if(document.getElementById("mySidepanel").style.width === "0px") {
    document.getElementById("mySidepanel").style.width = "500px";
    document.getElementById("contentArea").style.pointerEvents = "none";
    document.getElementById("editor").style.pointerEvents = "none";
    document.getElementById("settingIcon").style.transform = "rotate(180deg)";
    document.getElementById("blocker").style.pointerEvents = "all";
    document.getElementById("blocker").style.zIndex = "29";
    console.log("Executing action");
  }else if(document.getElementById("mySidepanel").style.width !== "0px") {
    document.getElementById("mySidepanel").style.width = "0";
    document.getElementById("contentArea").style.pointerEvents = "all";
    document.getElementById("editor").style.pointerEvents = "all";
    document.getElementById("settingIcon").style.transform = "rotate(0deg)";
    console.log("Executing action");
  }
});

document.getElementById("blocker").addEventListener("click", () => {
  document.getElementById("mySidepanel").style.width = "0";
  document.getElementById("contentArea").style.pointerEvents = "all";
  document.getElementById("editor").style.pointerEvents = "all";
  document.getElementById("settingIcon").style.transform = "rotate(0deg)";
  document.getElementById("blocker").style.pointerEvents = "none";
  document.getElementById("blocker").style.zIndex = "-2";
  document.getElementById("dateSelector").style.marginLeft = "-210px";
  document.getElementById("selectorExpBlock").style.left = "210px";
  document.getElementById("selectorExp").style.transform = "rotate(0deg)";
  console.log("Executing action");
});

document.getElementById("additionFirstExp").style.height = "0";
document.getElementsByClassName("bi bi-plus-circle")[0].addEventListener("click", () => {
  if(document.getElementById("additionFirstExp").style.height !== "0px") {
    document.getElementById("additionThreeDots").style.transform = "rotate(0deg)";
    document.getElementById("additionFirstExp").style.height = "0";
    document.getElementById("additionMicrophone").style.height = "0";
    document.getElementById("additionMicrophoneClose").style.opacity = "0";
    document.getElementById("additionCamera").style.height = "0";
    document.getElementById("additionMicrophone").style.opacity = "0";
    document.getElementById("additionCamera").style.opacity = "0";
  }else if(document.getElementById("additionFirstExp").style.height === "0px") {
    document.getElementById("additionThreeDots").style.transform = "rotate(45deg)";
    document.getElementById("additionFirstExp").style.height = "116px";
    document.getElementById("additionMicrophone").style.height = "36px";
    document.getElementById("additionCamera").style.height = "36px";
    document.getElementById("additionMicrophone").style.opacity = "100%";
    document.getElementById("additionCamera").style.opacity = "100%";
  }
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

document.getElementsByClassName("bi bi-mic")[0].addEventListener("click", () => {
  if(document.getElementById("additionSecondExp").style.width !== "0px") {
    document.getElementById("additionSecondExp").style.width = "0";
    document.getElementById("additionRecordStart").style.opacity = "0";
    document.getElementById("additionRecordStop").style.opacity = "0";
    document.getElementById("additionCamera").style.opacity = "100%";
    document.getElementById("additionCamera").style.pointerEvents = "all";
  }else if(document.getElementById("additionSecondExp").style.width === "0px") {
    document.getElementById("additionSecondExp").style.width = "56px";
    document.getElementById("additionRecordStart").style.opacity = "100%";
    document.getElementById("additionCamera").style.opacity = "0";
    document.getElementById("additionCamera").style.pointerEvents = "none";
    document.getElementById("additionRecordStart").style.pointerEvents = "all";
  }
  console.log("Executing action");
});

document.getElementsByClassName("bi bi-record-circle")[0].addEventListener("click", () => {
  document.getElementById("additionRecordStart").style.opacity = "0";
  document.getElementById("additionRecordStop").style.opacity = "100%";
  document.getElementById("additionRecordStop").style.pointerEvents = "all";
  document.getElementById("additionRecordStart").style.pointerEvents = "none";
  document.getElementById("additionMicrophoneClose").style.pointerEvents = "none";
  document.getElementById("additionMicrophone").style.pointerEvents = "none";
  document.getElementById("additionThreeDots").style.pointerEvents = "none";
  document.getElementById("sec").style.opacity = "100";
  timer();
  console.log("Executing action");
});

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

document.getElementById("selectorExpBlock").addEventListener("click", () => {
  if(document.getElementById("dateSelector").style.marginLeft === "-210px") {
    document.getElementById("dateSelector").style.marginLeft = "0px";
    document.getElementById("selectorExpBlock").style.left = "210px";
    document.getElementById("selectorExp").style.transform = "rotate(180deg)";
    document.getElementById("blocker").style.pointerEvents = "all";
    document.getElementById("blocker").style.zIndex = "29";
  }else {
    document.getElementById("dateSelector").style.marginLeft = "-210px";
    document.getElementById("selectorExpBlock").style.left = "210px";
    document.getElementById("selectorExp").style.transform = "rotate(0deg)";
    document.getElementById("blocker").style.zIndex = "-2";
    document.getElementById("blocker").style.pointerEvents = "none";
  }
});

document.getElementById("dateSelector").style.marginLeft = "0px";

setTimeout(function() {
  document.getElementById("dateSelector").style.marginLeft = "-210px";
}, 750);

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

var timerBlock = document.getElementById("timerBlock");

function createTimerText(time) {
  if(document.getElementById("timer")) {
    deleteTimerText();
  }
  var timerText = document.createElement("p");
  timerText.id = "timer";
  timerText.innerText = time.toString();
  timerBlock.appendChild(timerText);
}

function deleteTimerText() {
  var timerText = document.getElementById("timer");
  timerBlock.removeChild(timerText);
}
