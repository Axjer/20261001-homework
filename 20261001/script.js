const screen = document.getElementById("screen");
const btnLight = document.getElementById("btn-light");
const btnMode = document.getElementById("btn-mode");
const btnAlarm = document.getElementById("btn-alarm");

const elHours = document.getElementById("hours");
const elMinutes = document.getElementById("minutes");
const elSeconds = document.getElementById("seconds");
const elAmPm = document.getElementById("am-pm");
const elDay = document.getElementById("day");
const elDate = document.getElementById("date");

let is24HourFormat = false;
let isStopwatchMode = false;

let swInterval;
let swTime = 0; // in milliseconds
let swRunning = false;

const days = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

function updateTime() {
  if (isStopwatchMode) return;

  const now = new Date();

  // Day and Date
  elDay.textContent = days[now.getDay()];
  elDate.textContent = String(now.getDate()).padStart(2, "0");

  // Time
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  if (!is24HourFormat) {
    const ampm = hours >= 12 ? "PM" : "AM";
    elAmPm.textContent = ampm;
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
  } else {
    elAmPm.textContent = "24H";
  }

  elHours.textContent = String(hours).padStart(2, "0");
  elMinutes.textContent = String(minutes).padStart(2, "0");
  elSeconds.textContent = String(seconds).padStart(2, "0");
}

function updateStopwatch() {
  const minutes = Math.floor(swTime / 60000);
  const seconds = Math.floor((swTime % 60000) / 1000);
  const milliseconds = Math.floor((swTime % 1000) / 10);

  elHours.textContent = String(minutes).padStart(2, "0");
  elMinutes.textContent = String(seconds).padStart(2, "0");
  elSeconds.textContent = String(milliseconds).padStart(2, "0");
  elDay.textContent = "ST"; // Stopwatch mode indicator
  elDate.textContent = "00";
  elAmPm.textContent = swRunning ? "RUN" : "STP";
}

// Light Button (Hold to light up)
function turnOnLight() {
  screen.classList.add("light-on");
}
function turnOffLight() {
  screen.classList.remove("light-on");
}

btnLight.addEventListener("mousedown", turnOnLight);
btnLight.addEventListener("mouseup", turnOffLight);
btnLight.addEventListener("mouseleave", turnOffLight);
btnLight.addEventListener("touchstart", (e) => {
  e.preventDefault();
  turnOnLight();
});
btnLight.addEventListener("touchend", (e) => {
  e.preventDefault();
  turnOffLight();
});

// Reset stopwatch with LIGHT button when in stopwatch mode and stopped
btnLight.addEventListener("click", () => {
  if (isStopwatchMode && !swRunning) {
    swTime = 0;
    updateStopwatch();
  }
});

// Mode Button
btnMode.addEventListener("click", () => {
  isStopwatchMode = !isStopwatchMode;
  if (isStopwatchMode) {
    updateStopwatch();
  } else {
    updateTime();
  }
});

// Alarm / 24HR / Stopwatch Control
btnAlarm.addEventListener("click", () => {
  if (isStopwatchMode) {
    // Toggle stopwatch running
    if (swRunning) {
      clearInterval(swInterval);
      swRunning = false;
      updateStopwatch();
    } else {
      swRunning = true;
      const startTime = Date.now() - swTime;
      swInterval = setInterval(() => {
        swTime = Date.now() - startTime;
        updateStopwatch();
      }, 10);
      updateStopwatch();
    }
  } else {
    // Toggle 12/24 hour format
    is24HourFormat = !is24HourFormat;
    updateTime();
  }
});

// Update time every second
setInterval(() => {
  if (!isStopwatchMode) {
    updateTime();
  }
}, 1000);

// Initialize
updateTime();
