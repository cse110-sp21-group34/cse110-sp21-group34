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
});