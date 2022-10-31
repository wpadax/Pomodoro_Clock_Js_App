
function startDateTime() {
  const today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();
  let s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById("time-time").innerHTML = h + ":" + m + ":" + s;
  setTimeout(startDateTime, 1000);
}
function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

const periodTitle_p = document.querySelector(".actual-period-title");
const timer_p = document.querySelector(".timer");

const halfCircles = document.querySelectorAll(".half-circle");
const halfCircleTop = document.querySelector(".half-circle-top");

const pomodoroSettings_div = document.querySelector(".pomodoro-settings");
const shortBreakSettings_div = document.querySelector(".short-break-settings");
const longBreakSettings_div = document.querySelector(".long-break-settings");

//vars
let pomodoroTime_p = pomodoroSettings_div.querySelector(".pomodoro-time");
let shortBreak_p = shortBreakSettings_div.querySelector(".short-break-time");
let longBreak_p = longBreakSettings_div.querySelector(".long-break-time");

const pomodoro_time_str = pomodoroSettings_div.querySelector(".pomodoro-time");
const shortBreak_time_str =
  shortBreakSettings_div.querySelector(".short-break-time");
const longBreak_time_str =
  longBreakSettings_div.querySelector(".long-break-time");

const pomodoro_title = pomodoroSettings_div.querySelector(".pomodoro-title");
const shortBreak_title =
  shortBreakSettings_div.querySelector(".short-break-title");
const longBreak_title =
  longBreakSettings_div.querySelector(".long-break-title");

const pomodoroPlus_btn = pomodoroSettings_div.querySelector(".plus-button");
const pomodoroMinus_btn = pomodoroSettings_div.querySelector(".minus-button");
const shortBreakPlus_btn = shortBreakSettings_div.querySelector(".plus-button");
const shortBreakMinus_btn =
  shortBreakSettings_div.querySelector(".minus-button");
const longBreakPlus_btn = longBreakSettings_div.querySelector(".plus-button");
const longBreakMinus_btn = longBreakSettings_div.querySelector(".minus-button");

const start_btn = document.querySelector(".start-btn");
const pause_btn = document.querySelector(".pause-btn");
const reset_btn = document.querySelector(".reset-btn");

let pomodoroTime = parseInt(pomodoroTime_p.innerHTML) * 60000;
let shortBreakTime = parseInt(shortBreak_p.innerHTML) * 60000;
let longBreakTime = parseInt(longBreak_p.innerHTML) * 60000;

let isTimerPaused = false;
let interval, temp;
let percentage = 100;
let pomodoroCount = 1;
let currentPeriod = "pomodoro";

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

function convertMsToMinutesSeconds(milliseconds) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.round((milliseconds % 60000) / 1000);

  return seconds === 60
    ? `${minutes + 1}:00`
    : `${minutes}:${padTo2Digits(seconds)}`;
}

function convertMinSecToMS(string) {
  let stringParts = string.split(":");

  return (stringParts[0] * 60 + stringParts[1]) * 10;
}

function calculatePercentage(percentageValue, maxPercentageValue) {
  return 100 - (percentageValue / convertMinSecToMS(maxPercentageValue)) * 100;
}

function setProgressBar(percentage) {
  let degreeBasedOnPercentage = (percentage / 100) * 360;

  halfCircles.forEach((el) => {
    el.style.transform = `rotate(${degreeBasedOnPercentage}deg)`;

    if (degreeBasedOnPercentage >= 180) {
      halfCircles[0].style.transform = "rotate(180deg)";
      halfCircleTop.style.opacity = "0";
    } else {
      halfCircleTop.style.opacity = "1";
    }
  });
}

// start
pause_btn.disabled = true;
pause_btn.style.cursor = "default";
reset_btn.disabled = true;
reset_btn.style.cursor = "default";

function startCountdown() {
  start_btn.hidden = false;
  start_btn.style.cursor = "default";
  pause_btn.style.cursor = "pointer";
  reset_btn.style.cursor = "pointer";
  timer_p.style.fontSize = "300%";
  periodTitle_p.style.fontSize = "100%";
  setSettingsCursorToDefault();

  disableSettings();

  if (isTimerPaused) {
    isTimerPaused = false;
    pomodoroTime = temp;
  }

  interval = setInterval(function () {
    if (!isTimerPaused && currentPeriod === "pomodoro") {
      pomodoroTime -= 1000;
      percentage = calculatePercentage(pomodoroTime, pomodoroTime_p.innerHTML);
      setProgressBar(percentage);

      periodTitle_p.innerHTML = "Pomodoro " + pomodoroCount;
      timer_p.innerHTML = convertMsToMinutesSeconds(pomodoroTime);
      if (pomodoroTime === 0 && !(pomodoroCount % 4)) {
        new Audio("beep.mp3").play();
        currentPeriod = "longbreak";
        longBreakTime = parseInt(longBreak_p.innerHTML) * 60000;
      } else if (pomodoroTime === 0) {
        new Audio("beep.mp3").play();
        currentPeriod = "shortbreak";
        shortBreakTime = parseInt(shortBreak_p.innerHTML) * 60000;
      }
    } else if (!isTimerPaused && currentPeriod === "shortbreak") {
      shortBreakTime -= 1000;
      percentage = calculatePercentage(shortBreakTime, shortBreak_p.innerHTML);
      setProgressBar(percentage);

      periodTitle_p.innerHTML = "Short Break";
      timer_p.innerHTML = convertMsToMinutesSeconds(shortBreakTime);
      if (shortBreakTime === 0) {
        new Audio("beep.mp3").play();
        currentPeriod = "pomodoro";
        pomodoroTime = parseInt(pomodoroTime_p.innerHTML) * 60000;
        pomodoroCount++;
      }
    } else if (!isTimerPaused && currentPeriod === "longbreak") {
      longBreakTime -= 1000;
      percentage = calculatePercentage(longBreakTime, longBreak_p.innerHTML);
      setProgressBar(percentage);

      periodTitle_p.innerHTML = "Long Break";
      timer_p.innerHTML = convertMsToMinutesSeconds(longBreakTime);
      if (longBreakTime === 0) {
        new Audio("beep.mp3").play();
        currentPeriod = "pomodoro";
        pomodoroTime = parseInt(pomodoroTime_p.innerHTML) * 60000;
        pomodoroCount++;
      }
    }
  }, 1000);
}

function pauseCountdown() {
  if (isTimerPaused) {
    pomodoroTime = temp;
    pause_btn.innerHTML = "Pause";
    timer_p.style.fontSize = "300%";
    periodTitle_p.style.fontSize = "100%";
    isTimerPaused = false;
  } else {
    temp = pomodoroTime;
    pause_btn.innerHTML = "Continue";
    timer_p.style.fontSize = "100%";
    periodTitle_p.style.fontSize = "200%";
    isTimerPaused = true;
  }
}

function resetCountdown() {
  clearInterval(interval);
  isTimerPaused = false;
  start_btn.disabled = false;
  start_btn.style.cursor = "pointer";
  pause_btn.disabled = true;
  pause_btn.style.cursor = "default";
  reset_btn.disabled = true;
  reset_btn.style.cursor = "default";
  timer_p.style.fontSize = "100%";
  periodTitle_p.style.fontSize = "200%";
  pause_btn.innerHTML = "Pause";
  setSettingsCursorToPointer();

  enableSettings();

  timer_p.innerHTML = pomodoroTime_p.innerHTML;
  pomodoroTime = parseInt(pomodoroTime_p.innerHTML) * 60000;
  pomodoroCount = 1;
  currentPeriod = "pomodoro";
}

function increasePomodoroSetting() {
  pomodoroTime += 60000;
  pomodoroTime_p.innerHTML = convertMsToMinutesSeconds(pomodoroTime);
  timer_p.innerHTML = convertMsToMinutesSeconds(pomodoroTime);
}
function decreasePomodoroSetting() {
  if (pomodoroTime > 60000) {
    pomodoroTime -= 60000;
    pomodoroTime_p.innerHTML = convertMsToMinutesSeconds(pomodoroTime);
    timer_p.innerHTML = convertMsToMinutesSeconds(pomodoroTime);
  }
}
function increaseShortBreakSetting() {
  shortBreakTime += 60000;
  shortBreak_p.innerHTML = convertMsToMinutesSeconds(shortBreakTime);
}
function decreaseShortBreakSetting() {
  if (shortBreakTime > 60000) {
    shortBreakTime -= 60000;
    shortBreak_p.innerHTML = convertMsToMinutesSeconds(shortBreakTime);
  }
}
function increaseLongBreakSetting() {
  longBreakTime += 60000;
  longBreak_p.innerHTML = convertMsToMinutesSeconds(longBreakTime);
}
function decreaseLongBreakSetting() {
  if (longBreakTime > 60000) {
    longBreakTime -= 60000;
    longBreak_p.innerHTML = convertMsToMinutesSeconds(longBreakTime);
  }
}

function disableSettings() {
  pomodoroSettings_div.style.borderColor = "gray";
  pomodoro_time_str.style.color = "gray";
  pomodoro_title.style.color = "gray";
  pomodoroPlus_btn.disabled = true;
  pomodoroPlus_btn.style.backgroundColor = "gray";
  pomodoroMinus_btn.disabled = true;
  pomodoroMinus_btn.style.backgroundColor = "gray";

  shortBreakSettings_div.style.borderColor = "gray";
  shortBreak_time_str.style.color = "gray";
  shortBreak_title.style.color = "gray";
  shortBreakPlus_btn.disabled = true;
  shortBreakPlus_btn.style.backgroundColor = "gray";
  shortBreakMinus_btn.disabled = true;
  shortBreakMinus_btn.style.backgroundColor = "gray";

  longBreakSettings_div.style.borderColor = "gray";
  longBreak_time_str.style.color = "gray";
  longBreak_title.style.color = "gray";
  longBreakPlus_btn.disabled = true;
  longBreakPlus_btn.style.backgroundColor = "gray";
  longBreakMinus_btn.disabled = true;
  longBreakMinus_btn.style.backgroundColor = "gray";

  start_btn.disabled = true;
  pause_btn.disabled = false;
  reset_btn.disabled = false;
}
function enableSettings() {
  pomodoroSettings_div.style.borderColor = "black";
  pomodoro_time_str.style.color = "black";
  pomodoro_title.style.color = "black";
  pomodoroPlus_btn.disabled = false;
  pomodoroPlus_btn.style.backgroundColor = "black";
  pomodoroMinus_btn.disabled = false;
  pomodoroMinus_btn.style.backgroundColor = "black";

  shortBreakSettings_div.style.borderColor = "black";
  shortBreak_time_str.style.color = "black";
  shortBreak_title.style.color = "black";
  shortBreakPlus_btn.disabled = false;
  shortBreakPlus_btn.style.backgroundColor = "black";
  shortBreakMinus_btn.disabled = false;
  shortBreakMinus_btn.style.backgroundColor = "black";

  longBreakSettings_div.style.borderColor = "black";
  longBreak_time_str.style.color = "black";
  longBreak_title.style.color = "black";
  longBreakPlus_btn.disabled = false;
  longBreakPlus_btn.style.backgroundColor = "black";
  longBreakMinus_btn.disabled = false;
  longBreakMinus_btn.style.backgroundColor = "black";

  start_btn.disabled = false;
  pause_btn.disabled = true;
  reset_btn.disabled = true;
}

function setSettingsCursorToDefault() {
  pomodoroPlus_btn.style.cursor = "default";
  pomodoroMinus_btn.style.cursor = "default";
  shortBreakPlus_btn.style.cursor = "default";
  shortBreakMinus_btn.style.cursor = "default";
  longBreakPlus_btn.style.cursor = "default";
  longBreakMinus_btn.style.cursor = "default";
}
function setSettingsCursorToPointer() {
  pomodoroPlus_btn.style.cursor = "pointer";
  pomodoroMinus_btn.style.cursor = "pointer";
  shortBreakPlus_btn.style.cursor = "pointer";
  shortBreakMinus_btn.style.cursor = "pointer";
  longBreakPlus_btn.style.cursor = "pointer";
  longBreakMinus_btn.style.cursor = "pointer";
}

function addEventListeners() {
  start_btn.addEventListener("click", startCountdown);
  pause_btn.addEventListener("click", pauseCountdown);
  reset_btn.addEventListener("click", resetCountdown);

  pomodoroPlus_btn.addEventListener("click", increasePomodoroSetting);
  pomodoroMinus_btn.addEventListener("click", decreasePomodoroSetting);
  shortBreakPlus_btn.addEventListener("click", increaseShortBreakSetting);
  shortBreakMinus_btn.addEventListener("click", decreaseShortBreakSetting);
  longBreakPlus_btn.addEventListener("click", increaseLongBreakSetting);
  longBreakMinus_btn.addEventListener("click", decreaseLongBreakSetting);
}

addEventListeners();
