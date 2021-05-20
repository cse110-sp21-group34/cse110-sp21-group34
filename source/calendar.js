/* eslint-disable no-use-before-define */
const newEditor = require("./editor_v2/index");

/**
 * @summary Updates the days and dates depending upon the year and month selected.
 */
function updateDates() {
  const currYear = Number(document.querySelector("#yearNum").innerHTML); // Obtains selected year
  const selectOption = document.querySelector("#monthSelector"); // Obtains the month selecting element.

  // Obtains the appropriate month in 0-indexed month format.
  // eslint-disable-next-line prettier/prettier
  const currMonth = Number(selectOption.options[selectOption.selectedIndex].value); 

  // Obtains number of days in a given month and day
  const numDays = new Date(
    Date.UTC(currYear, currMonth + 1, 0, 0, 0, 0)
  ).getDate();

  // Initialize div element to contain all dates.
  const newDayList = document.createElement("div");
  newDayList.classList.add("dayList");

  // Each iteration of for loop handles creation of one day
  for (let i = 1; i <= numDays; i += 1) {
    const currDate = i; // Obtains current date

    // Obtains the day of the current date in English format with first three letters
    const utcDate = new Date(Date.UTC(currYear, currMonth, currDate));
    const options = { weekday: "long" };
    // eslint-disable-next-line prettier/prettier
    const currDay = new Intl.DateTimeFormat("en-US", options).format(utcDate).substring(0, 3);

    // Initialize div element to contain one day
    const oneDayDiv = document.createElement("div");
    oneDayDiv.classList.add("oneDay");
    // eslint-disable-next-line no-loop-func
    oneDayDiv.addEventListener("click", (event) => {
      // eslint-disable-next-line prettier/prettier
      window.history.pushState({},
        // eslint-disable-next-line prettier/prettier
        `entry${utcDate.getMonth() + 1}${currDate}${currYear}`, 
        `/#entry${utcDate.getMonth() + 1}${currDate}${currYear}`
      );
      const prevDate = document.getElementsByClassName("oneDayActive");
      if (prevDate[0] !== undefined) {
        prevDate[0].classList.remove("oneDayActive");
      }
      oneDayDiv.classList.add("oneDayActive");
      document
        .getElementById("contentArea")
        .removeChild(document.getElementById("editor"));
      const editorDiv = document.createElement("div");
      editorDiv.id = "editor";
      document.getElementById("contentArea").appendChild(editorDiv);
      const editor = newEditor(
        `${utcDate.getFullYear()}-${
          utcDate.getMonth() + 1
        }-${utcDate.getDate()}`,
        "editor"
      );
      // eslint-disable-next-line prettier/prettier
      document.getElementsByClassName("dailyDate")[0].innerHTML = 
        // eslint-disable-next-line prettier/prettier
        `${utcDate.getMonth() + 1}/${currDate}, ${currDay}`;
      routerDate = currDate;
      routerYear = currYear;
      routerMonth = utcDate.getMonth();
    });

    // Intialize the elements that contain the day and the date
    const weekdayDiv = document.createElement("p");
    weekdayDiv.classList.add("weekday");
    weekdayDiv.innerHTML = currDay;
    const monthdayDiv = document.createElement("p");
    monthdayDiv.classList.add("monthday");
    monthdayDiv.innerHTML = currDate;

    // Appends day and date elements to div for one day
    oneDayDiv.id = `${utcDate.getMonth() + 1}${currDate}${currYear}`;
    oneDayDiv.appendChild(weekdayDiv);
    oneDayDiv.appendChild(monthdayDiv);

    // Appends one day to the list of days
    newDayList.appendChild(oneDayDiv);
  }

  // Replaces the old list of days with the current list.
  const oldDayList = document.querySelector(".dayList");
  oldDayList?.replaceWith(newDayList); // Ignore null day list using (?.)

  if (routerYear === currYear) {
    if (routerMonth === currMonth) {
      document
        .getElementById(`${currMonth + 1}${routerDate}${routerYear}`)
        .classList.add("oneDayActive");
    }
  }
}

// Updates year to previous year if the year is decreased and updates dates accordingly.
document.querySelector("#lastYear").addEventListener("click", () => {
  const currentYear = document.querySelector("#yearNum").innerHTML;
  document.querySelector("#yearNum").innerHTML = Number(currentYear) - 1;
  updateDates(); // Updates dates accordingly
});

// Updates year to next year if the year is increased and updates dates accordingly.
document.querySelector("#nextYear").addEventListener("click", () => {
  const currentYear = document.querySelector("#yearNum").innerHTML;
  document.querySelector("#yearNum").innerHTML = Number(currentYear) + 1;
  updateDates(); // Updates dates accordingly
});

// Updates dates accordingly when the month is changed
document.querySelector("#monthSelector").addEventListener("change", () => {
  updateDates();
});

// Starts up the calendar with the current month
const todayDate = new Date();
const todayOptions = { weekday: "long" };
const todayDay = new Intl.DateTimeFormat("en-US", todayOptions)
  .format(todayDate)
  .substring(0, 3);
document.querySelector("#monthSelector").value = todayDate.getMonth();
// eslint-disable-next-line prettier/prettier
document.getElementsByClassName("dailyDate")[0].innerHTML = 
  // eslint-disable-next-line prettier/prettier
  `${todayDate.getMonth() + 1}/${todayDate.getDate()}, ${todayDay}`;
window.history.pushState(
  {},
  // eslint-disable-next-line prettier/prettier
  `entry${todayDate.getMonth() + 1}${todayDate.getDate()}${todayDate.getFullYear()}`, 
  // eslint-disable-next-line prettier/prettier
  `/#entry${todayDate.getMonth() + 1}${todayDate.getDate()}${todayDate.getFullYear()}`
);
let routerMonth = todayDate.getMonth();
let routerYear = todayDate.getFullYear();
let routerDate = todayDate.getDate();

// Instantiates the dates when page is first loaded
updateDates();
document
  .getElementById(`${todayDate.getMonth() + 1}${todayDate.getDate()}${todayDate.getFullYear()}`)
  .classList.add("oneDayActive");
newEditor(
    `${todayDate.getFullYear()}-${
      todayDate.getMonth() + 1
    }-${todayDate.getDate()}`,
    "editor"
);