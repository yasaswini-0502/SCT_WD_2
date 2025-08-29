let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let running = false;
let lapCount = 0;
let countdownMode = false;
let countdownDuration = 60000; // default 1 minute

const display = document.getElementById("display");
const startPauseBtn = document.getElementById("startPauseBtn");
const lapBtn = document.getElementById("lapBtn");
const resetBtn = document.getElementById("resetBtn");
const themeBtn = document.getElementById("themeBtn");
const countdownBtn = document.getElementById("countdownBtn");
const countdownOptions = document.getElementById("countdownOptions");
const lapsContainer = document.getElementById("laps");

function pad(number, length) {
  return number.toString().padStart(length, '0');
}

function formatTime(ms) {
  const hundredths = Math.floor((ms % 1000) / 10);
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);
  return `${pad(minutes, 2)}:${pad(seconds, 2)}:${pad(hundredths, 2)}`;
}

function updateDisplay() {
  display.textContent = formatTime(elapsedTime);

  // Highlight when less than 10 seconds left in countdown mode
  if (countdownMode && elapsedTime <= 10000 && running) {
    display.style.color = "red";
    display.style.fontWeight = "bold";
  } else {
    display.style.color = "";
    display.style.fontWeight = "";
  }

  display.classList.add("animate");
  setTimeout(() => display.classList.remove("animate"), 100);
}

function startPause() {
  if (!running) {
    startTime = Date.now() - (countdownMode ? (countdownDuration - elapsedTime) : elapsedTime);
    timerInterval = setInterval(() => {
      if (countdownMode) {
        elapsedTime = countdownDuration - (Date.now() - startTime);
        if (elapsedTime <= 0) {
          clearInterval(timerInterval);
          elapsedTime = 0;
          updateDisplay();
          alert("⏰ Time's up!");
          running = false;
          startPauseBtn.textContent = "▶ Start";
        }
      } else {
        elapsedTime = Date.now() - startTime;
      }
      updateDisplay();
    }, 10);
    startPauseBtn.textContent = "⏸ Pause";
    running = true;
  } else {
    clearInterval(timerInterval);
    startPauseBtn.textContent = "▶ Start";
    running = false;
  }
}

function reset() {
  clearInterval(timerInterval);
  elapsedTime = countdownMode ? countdownDuration : 0;
  updateDisplay();
  startPauseBtn.textContent = "▶ Start";
  running = false;
  lapsContainer.innerHTML = "";
  lapCount = 0;
}

function lap() {
  if (running && !countdownMode) {
    lapCount++;
    const li = document.createElement("li");
    li.textContent = `Lap ${lapCount}: ${formatTime(elapsedTime)}`;
    lapsContainer.appendChild(li);
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

function toggleCountdown() {
  countdownMode = !countdownMode;
  reset();
  if (countdownMode) {
    countdownBtn.textContent = "⏱ Stopwatch";
    countdownOptions.style.display = "block";
  } else {
    countdownBtn.textContent = "⏱ Countdown";
    countdownOptions.style.display = "none";
  }
}

function setCountdown(minutes) {
  countdownDuration = minutes * 60 * 1000;
  reset();
  alert(`⏱ Countdown set to ${minutes} minute(s)`);
}

// Event listeners
startPauseBtn.addEventListener("click", startPause);
resetBtn.addEventListener("click", reset);
lapBtn.addEventListener("click", lap);
themeBtn.addEventListener("click", toggleTheme);
countdownBtn.addEventListener("click", toggleCountdown);
document.querySelectorAll(".setCountdown").forEach(btn => {
  btn.addEventListener("click", () => setCountdown(btn.dataset.minutes));
});

// Initialize
updateDisplay();
