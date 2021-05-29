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
  document.getElementById("mySidepanel").style.width = "500px";
  document.getElementById("contentArea").style.pointerEvents = "none";
  document.getElementById("editor").style.pointerEvents = "none";
  console.log("Executing action");
});

/* Set the width of the sidebar to 0 (hide it) */
document.getElementsByClassName("closebtn")[0].addEventListener("click", () => {
  document.getElementById("mySidepanel").style.width = "0";
  document.getElementById("contentArea").style.pointerEvents = "all";
  document.getElementById("editor").style.pointerEvents = "all";
  console.log("Executing action");
});

document.getElementsByClassName("bi bi-plus-square-dotted")[0].addEventListener("click", () => {
  if(document.getElementById("additionFirstExp").style.height !== "0px") {
    document.getElementById("additionFirstExp").style.height = "0";
    document.getElementById("additionMicrophone").style.height = "0";
    document.getElementById("additionCamera").style.height = "0";
    document.getElementById("additionMicrophone").style.opacity = "0";
    document.getElementById("additionCamera").style.opacity = "0";
  }else if(document.getElementById("additionFirstExp").style.height === "0px") {
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
  }
  console.log("Executing action");
});

document.getElementsByClassName("bi bi-mic")[0].addEventListener("click", () => {
  if(document.getElementById("additionSecondExp").style.width !== "0px") {
    document.getElementById("additionSecondExp").style.width = "0";
    document.getElementById("additionRecordStart").style.opacity = "0";
    document.getElementById("additionRecordStop").style.opacity = "0";
    document.getElementById("additionCamera").style.opacity = "100%";
  }else if(document.getElementById("additionSecondExp").style.width === "0px") {
    document.getElementById("additionSecondExp").style.width = "56px";
    document.getElementById("additionRecordStart").style.opacity = "100%";
    //document.getElementById("additionRecordStop").style.opacity = "100%";
    document.getElementById("additionCamera").style.opacity = "0";
  }
  console.log("Executing action");
});

document.getElementsByClassName("bi bi-record-circle")[0].addEventListener("click", () => {
  document.getElementById("additionRecordStart").style.opacity = "0";
  document.getElementById("additionRecordStop").style.opacity = "100%";
  document.getElementById("additionRecordStop").style.pointerEvents = "all";
  document.getElementById("additionRecordStart").style.pointerEvents = "none";
  console.log("Executing action");
});

document.getElementsByClassName("bi bi-stop-circle")[0].addEventListener("click", () => {
  document.getElementById("additionRecordStop").style.opacity = "0";
  document.getElementById("additionRecordStart").style.opacity = "100%";
  document.getElementById("additionRecordStart").style.pointerEvents = "all";
  document.getElementById("additionRecordStop").style.pointerEvents = "none";
  console.log("Executing action");
});