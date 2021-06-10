const newEditor = require('editor');
const storage = require('storage');
const voice = require('./voice');
const webcam = require('./webcam');
const { createLabel } = require('./label');

/**
 * @summary Updates the days and dates depending upon the year and month selected.
 */
function updateDates() {
  const currYear = Number(document.querySelector("#yearNum").innerHTML); // Obtains selected year
  const selectOption = document.querySelector("#monthSelector"); // Obtains the month selecting element.

  // Obtains the appropriate month in 0-indexed month format.
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
    const currDay = new Intl.DateTimeFormat(lang, options).format(utcDate);

    // Initialize div element to contain one day
    const oneDayDiv = document.createElement("div");
    oneDayDiv.classList.add("oneDay");
    oneDayDiv.addEventListener("click", (event) => {
      window.history.pushState({},
        `entry${utcDate.getMonth() + 1}${currDate}${currYear}`, 
        `/#entry${utcDate.getMonth() + 1}${currDate}${currYear}`
      );
      const prevDate = document.getElementsByClassName("oneDayActive");
      if (prevDate[0] !== undefined) {
        prevDate[0].classList.remove("oneDayActive");
      }
      oneDayDiv.classList.add("oneDayActive");

      // To instantiate the storage for the text editor for current date.
      if (storage.currentEditor) {
        storage.currentEditor.isReady.then(() => {
          storage.currentDate = `${utcDate.getFullYear()}-${
            utcDate.getMonth() + 1
          }-${utcDate.getDate()}`;
          let saved_data = storage.journals.get(storage.currentDate);

          if (Object.keys(saved_data).length === 0) {
            storage.currentEditor.clear();
          }
          else {
            storage.currentEditor.render(saved_data);
          }

          let labels = storage.journals.getLabelDate(storage.currentDate);
          if (Object.keys(labels) !== 0) {
            document.getElementsByClassName('pcolor')[0].innerHTML = '';
            for (let label in labels) {
              createLabel(label, labels[label].color);
            }
          }
        });
      }
      // Determines the format of date being displayed using the selected language.
      const editorOptions = { weekday: dayLength };
      const editorDay = new Intl.DateTimeFormat(lang, editorOptions).format(
        utcDate
      );
      document.getElementsByClassName("dailyDate")[0].innerHTML =
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

  // Handles the selection of correct date if month/year goes out of scope
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

  // Displays the header with the date being selected.
  const routerFullDate = new Date(Date.UTC(routerYear, routerMonth, routerDate));
  const editorOptions = { weekday: dayLength };
  const editorDay = new Intl.DateTimeFormat(lang, editorOptions).format(
    routerFullDate
  );
  document.getElementsByClassName("dailyDate")[0].innerHTML =
        `${routerMonth + 1}/${routerDate}, ${editorDay}`;
}

/** 
 * Updates the months with the selected language.
 */
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

// Starts up the calendar in English language
let lang = "en-US";
let length = "short";
let dayLength = "long";

// Starts up the calendar with the current month, day, year 
const todayDate = new Date();
const todayOptions = { weekday: length };
const todayDay = new Intl.DateTimeFormat(lang, todayOptions).format(todayDate);
storage.currentDate = `${todayDate.getFullYear()}-${todayDate.getMonth() + 1}-${todayDate.getDate()}`;

// Handles the route and saves the selected date
document.querySelector("#monthSelector").value = todayDate.getMonth();
document.getElementsByClassName("dailyDate")[0].innerHTML = 
  `${todayDate.getMonth() + 1}/${todayDate.getDate()}, ${todayDay}`;
window.history.pushState(
  {},
  `entry${todayDate.getMonth() + 1}${todayDate.getDate()}${todayDate.getFullYear()}`, 
  `/#entry${todayDate.getMonth() + 1}${todayDate.getDate()}${todayDate.getFullYear()}`
);
let routerMonth = todayDate.getMonth();
let routerYear = todayDate.getFullYear();
let routerDate = todayDate.getDate();

/**
 * Sets the options for the specific language when it is changed.
 */
document.getElementById("languageSelector").addEventListener("change", () => {
  if (document.getElementById("languageSelector").value === "English") {
    lang = "en-US";
    length = "short";
    dayLength = "long";
    document.getElementById("language").innerText = "Language";
    document.getElementById("about").innerText = "About Equinox";
  } else if (document.getElementById("languageSelector").value === "Chinese") {
    lang = "zh";
    length = "long";
    dayLength = length;
    document.getElementById("language").innerText = "语言";
    document.getElementById("about").innerText = "关于Equinox";
  } else if (document.getElementById("languageSelector").value === "Tamil") {
    lang = "ta";
    length = "long";
    dayLength = "long";
    document.getElementById("language").innerText = "மொழி";
    document.getElementById("about").innerText = "எக்வினாக்சு பற்றி";
  } else if (
    document.getElementById("languageSelector").value === "Bahasa Indonesia") {
    lang = "id";
    length = "long";
    dayLength = length;
    document.getElementById("language").innerText = "Bahasa";
    document.getElementById("about").innerText = "Tentang Equinox";
  } else {
    lang = "ar-EG";
    document.getElementById("language").innerText = "اللغة";
    document.getElementById("about").innerText = "عن اقوينوكس";
  }
  // Stores Language so that it is retained even during your next visit.
  storage.journals.isReady.then(() => storage.journals.settings = {lang: lang});
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
  .getElementById(`${todayDate.getMonth() + 1}${todayDate.getDate()}${todayDate.getFullYear()}`);


// Instantiates the storage for today's entries.
todayElement.classList.add("oneDayActive");
storage.journals.isReady
  .then(() => {
    if (storage.journals.settings.lang) {
      const languageSelectorOrder = ['en-US', 'zh', "ta", "id", "ar-EG"];
      lang = storage.journals.settings.lang;
      const languageSelector = document.getElementById("languageSelector");
      languageSelector.selectedIndex = languageSelectorOrder.findIndex((e) => e === lang);
      languageSelector.dispatchEvent(new Event('change'));
    }
    let labels = storage.journals.getLabelDate(storage.currentDate);
    if (Object.keys(labels) !== 0) {
      for (let label in labels) {
        createLabel(label, labels[label].color);
      }
    }
  })
  .then(() => {storage.currentEditor = newEditor("editor")})
  .then(() => voice.createButton())
  .then(() => webcam());
document.getElementsByClassName("dayList")[0].scrollTop =
  todayElement.offsetTop;
