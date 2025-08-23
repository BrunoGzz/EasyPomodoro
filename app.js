// DOM elements
const timerTitle = document.getElementById("timer-title");
const timerInformationTitle = document.getElementById("timer-information-title");
const startTimerButton = document.getElementById("start-timer-button");
const optionsButton = document.getElementById("options-button");
const optionsModal = document.getElementById("options-modal");
const optionsForm = document.getElementById("options-form");
const closeOptionsButton = document.getElementById("close-options");
const infoButton = document.getElementById("info-button");
const infoModal = document.getElementById("information-modal");
const closeInfoButton = document.getElementById("close-info");

// Timer settings

// Check and set default for work duration if missing
if (!localStorage.getItem("workDuration")) {
  localStorage.setItem("workDuration", 25); // in minutes
}

// Check and set default for short break duration if missing
if (!localStorage.getItem("shortBreakDuration")) {
  localStorage.setItem("shortBreakDuration", 5); // in minutes
}

// Check and set default for long break duration if missing
if (!localStorage.getItem("longBreakDuration")) {
  localStorage.setItem("longBreakDuration", 15); // in minutes
}

// Retrieve and convert values from localStorage
let workDuration = parseInt(localStorage.getItem("workDuration")) * 60; // Convert minutes to seconds
let shortBreakDuration = parseInt(localStorage.getItem("shortBreakDuration")) * 60;
let longBreakDuration = parseInt(localStorage.getItem("longBreakDuration")) * 60;

let timeRemaining = workDuration;
let isRunning = false;
let isBreak = false;
let completedPomodoros = 0;
let timer; // For interval ID

// Utility function to format time (MM:SS)
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// Update timer display
function updateTimerDisplay() {
  timerTitle.textContent = formatTime(timeRemaining);
}

// Update timer information title
function updateTimerInformationTitle() {
  if (isBreak) {
    timerInformationTitle.textContent = completedPomodoros % 4 === 0 ? "Long Break" : "Short Break";
  } else {
    timerInformationTitle.textContent = "Work Time";
  }
}

// Start timer
function startTimer() {
  if (isRunning) return; // Prevent multiple timers
  isRunning = true;
  startTimerButton.textContent = "Pause";
  timer = setInterval(() => {
    if (timeRemaining > 0) {
      timeRemaining--;
      updateTimerDisplay();
    } else {
      clearInterval(timer);
      isRunning = false;
      handleTimerEnd();
    }
  }, 1000);
}

// Pause timer
function pauseTimer() {
  if (!isRunning) return;
  clearInterval(timer);
  isRunning = false;
  startTimerButton.textContent = "Resume";
}

// Resume timer
function resumeTimer() {
  if (isRunning) return;
  startTimer();
}

// Handle timer end
function handleTimerEnd() {
  if (isBreak) {
    isBreak = false;
    timeRemaining = workDuration;
  } else {
    completedPomodoros++;
    isBreak = true;
    timeRemaining = completedPomodoros % 4 === 0 ? longBreakDuration : shortBreakDuration;
  }
  updateTimerInformationTitle();
  updateTimerDisplay();
  startTimer();
}

// Handle options form submission
optionsForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const workInput = document.getElementById("work-duration").value;
  const shortBreakInput = document.getElementById("short-break-duration").value;
  const longBreakInput = document.getElementById("long-break-duration").value;

  // Save durations in localStorage
  localStorage.setItem("workDuration", workInput);
  localStorage.setItem("shortBreakDuration", shortBreakInput);
  localStorage.setItem("longBreakDuration", longBreakInput);

  // Update variables
  workDuration = parseInt(workInput) * 60;
  shortBreakDuration = parseInt(shortBreakInput) * 60;
  longBreakDuration = parseInt(longBreakInput) * 60;

  timeRemaining = workDuration; // Reset timer to new work duration
  updateTimerDisplay();
  updateTimerInformationTitle();
  optionsModal.classList.add("hidden"); // Close the modal
});

// Open options modal and pre-fill inputs
optionsButton.addEventListener("click", () => {
  document.getElementById("work-duration").value = localStorage.getItem("workDuration") || 25;
  document.getElementById("short-break-duration").value = localStorage.getItem("shortBreakDuration") || 5;
  document.getElementById("long-break-duration").value = localStorage.getItem("longBreakDuration") || 15;
  optionsModal.classList.remove("hidden");
});

// Close options modal
/*closeOptionsButton.addEventListener("click", () => {
  optionsModal.classList.add("hidden");
});*/

// Open information modal
infoButton.addEventListener("click", () => {
  infoModal.classList.remove("hidden");
});

// Close info modal
closeInfoButton.addEventListener("click", () => {
  infoModal.classList.add("hidden");
});

// Start/pause/resume button logic
startTimerButton.addEventListener("click", () => {
  if (isRunning) {
    pauseTimer();
  } else {
    resumeTimer();
  }
});

// Initialize timer display and information
updateTimerDisplay();
updateTimerInformationTitle();
