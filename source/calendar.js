/* eslint-disable no-use-before-define */
const newEditor = require('editor');
const storage = require('storage');

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
    const options = { weekday: length };
    // eslint-disable-next-line prettier/prettier
    const currDay = new Intl.DateTimeFormat(lang, options).format(utcDate);

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
      const editorOptions = { weekday: dayLength };
      const editorDay = new Intl.DateTimeFormat(lang, editorOptions).format(
        utcDate
      );
      document.getElementsByClassName("dailyDate")[0].innerHTML =
        // eslint-disable-next-line prettier/prettier
        `${utcDate.getMonth() + 1}/${currDate}, ${editorDay}`;
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
      const routerElement = document.getElementById(
        `${currMonth + 1}${routerDate}${routerYear}`
      );
      routerElement.classList.add("oneDayActive");
      document.getElementsByClassName("dayList")[0].scrollTop =
        routerElement.offsetTop;
    }
  }

  const routerFullDate = new Date(Date.UTC(routerYear, routerMonth, routerDate));
  const editorOptions = { weekday: dayLength };
  const editorDay = new Intl.DateTimeFormat(lang, editorOptions).format(
    routerFullDate
  );
  document.getElementsByClassName("dailyDate")[0].innerHTML =
    // eslint-disable-next-line prettier/prettier
        `${routerMonth + 1}/${routerDate}, ${editorDay}`;
}

function updateMonthLanguage() {
  const monthOptions = { month: "long" };
  for (let i = 0; i < 12; i += 1) {
    const date = new Date(Date.UTC(2021, i));
    document.getElementById(`month${i}`).innerHTML = new Intl.DateTimeFormat(
      lang,
      monthOptions
    ).format(date);
  }
}

// Starts up the calendar with the current month
let lang = "en-US";
let length = "short";
let dayLength = "long";

const todayDate = new Date();
const todayOptions = { weekday: length };
const todayDay = new Intl.DateTimeFormat(lang, todayOptions).format(todayDate);
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

document.getElementById("languageSelector").addEventListener("change", () => {
  // TODO: Placeholder check when we implement settings
  if (document.getElementById("languageSelector").value === "English") {
    lang = "en-US";
    length = "short";
    dayLength = "long";
    document.getElementById("language").innerText = "Language";
    document.getElementById("darkMode").innerText = "Dark Mode";
    document.getElementById("autoLabel").innerText = "Auto-Generated Labels";
    document.getElementById("about").innerText = "About Equinox";
  } else if (document.getElementById("languageSelector").value === "Chinese") {
    lang = "zh";
    length = "long";
    dayLength = length;
    document.getElementById("language").innerText = "语言";
    document.getElementById("darkMode").innerText = "暗色模式";
    document.getElementById("autoLabel").innerText = "自动生成标签";
    document.getElementById("about").innerText = "关于Equinox";
  } else if (document.getElementById("languageSelector").value === "Tamil") {
    lang = "ta";
    length = "long";
    dayLength = "long";
    document.getElementById("language").innerText = "மொழி";
    document.getElementById("darkMode").innerText = "இருண்ட பயன்முறை";
    document.getElementById("autoLabel").innerText = "தானியங்கி விவரங்கள்";
    document.getElementById("about").innerText = "எக்வினாக்சு பற்றி";
  } else if (
    document.getElementById("languageSelector").value === "Bahasa Indonesia") {
    lang = "id";
    length = "long";
    dayLength = length;
    document.getElementById("language").innerText = "Bahasa";
    document.getElementById("darkMode").innerText = "Mode Gelap";
    document.getElementById("autoLabel").innerText = "Label Otomatis";
    document.getElementById("about").innerText = "Tentang Equinox";
  } else {
    lang = "ar-EG";
    document.getElementById("language").innerText = "Language";
    document.getElementById("darkMode").innerText = "Dark Mode";
    document.getElementById("autoLabel").innerText = "Auto-Generated Labels";
    document.getElementById("about").innerText = "About Equinox";
  }
  updateDates();
  updateMonthLanguage();
});

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

// Instantiates the dates when page is first loaded
updateDates();
const todayElement = document
  // eslint-disable-next-line prettier/prettier
  .getElementById(`${todayDate.getMonth() + 1}${todayDate.getDate()}${todayDate.getFullYear()}`);

todayElement.classList.add("oneDayActive");
// eslint-disable-next-line prettier/prettier
storage.journals.isReady.then(() => newEditor(`${todayDate.getFullYear()}-${todayDate.getMonth() + 1}-${todayDate.getDate()}`,"editor"));
document.getElementsByClassName("dayList")[0].scrollTop =
  todayElement.offsetTop;
