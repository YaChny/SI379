import "./style.css";

const TASK_PLACEHOLDER = "Task Description";
const addTaskButton = document.querySelector("button#add-task");
const taskList = document.querySelector("ul#tasks");
const timerContainer = document.createElement("div");
timerContainer.id = "timer-container";
timerContainer.innerHTML = `
  <div>
    <label>Work (min): <input type="number" id="work-duration" value="25"></label>
    <label>Break (min): <input type="number" id="break-duration" value="5"></label>
  </div>
  <div id="timer"></div>
  <button id="cancel-timer" style="display:none">Cancel Timer</button>
`;
document.body.appendChild(timerContainer);

const workInput = document.getElementById("work-duration");
const breakInput = document.getElementById("break-duration");
const timerDisplay = document.getElementById("timer");
const cancelBtn = document.getElementById("cancel-timer");

let timerInterval = null;
let currentMode = 'idle';
let currentTaskIndex = null;
let secondsRemaining = 0;

function startTimer(index) {
  if (timerInterval) return; // Prevent multiple timers
  const workMinutes = parseInt(workInput.value) || 25;
  const breakMinutes = parseInt(breakInput.value) || 5;

  currentTaskIndex = index;
  currentMode = 'work';
  secondsRemaining = workMinutes * 60;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    secondsRemaining--;
    updateTimerDisplay();
    if (secondsRemaining <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      if (currentMode === 'work') {
        const lemonSpan = taskList.children[index].querySelector(".lemons");
        lemonSpan.textContent += '🍋';
        currentMode = 'break';
        secondsRemaining = breakMinutes * 60;
        startTimer(index); // start break session
      } else {
        currentMode = 'idle';
        timerDisplay.textContent = '';
        cancelBtn.style.display = 'none';
      }
    }
  }, 1000);
  cancelBtn.style.display = 'inline-block';
}

function updateTimerDisplay() {
  const min = Math.floor(secondsRemaining / 60);
  const sec = secondsRemaining % 60;
  timerDisplay.textContent = `${currentMode === 'work' ? 'Work' : 'Break'}: ${min}:${sec.toString().padStart(2, '0')}`;
}

cancelBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
  currentMode = 'idle';
  timerDisplay.textContent = '';
  cancelBtn.style.display = 'none';
});

const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
function saveTasks() {
  const saveData = Array.from(taskList.children).map(li => ({
    name: li.querySelector("span").textContent,
    lemons: li.querySelector(".lemons").textContent.length
  }));
  localStorage.setItem('tasks', JSON.stringify(saveData));
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach(({ name, lemons }) => addTask(name, lemons));
}

function addTask(description = '', lemonCount = 0) {
  let taskDescription = description;

  const newTask = document.createElement("li");
  const descriptionSpan = document.createElement("span");
  const descriptionInput = document.createElement("input");
  const removeButton = document.createElement("button");
  const startButton = document.createElement("button");
  const lemonSpan = document.createElement("span");
  lemonSpan.className = "lemons";
  lemonSpan.textContent = '🍋'.repeat(lemonCount);

  removeButton.textContent = "Remove";
  removeButton.addEventListener("click", removeTask);

  startButton.textContent = "Start";
  startButton.addEventListener("click", () => startTimer(getTaskIndex()));

  descriptionInput.setAttribute("type", "text");
  descriptionInput.setAttribute("placeholder", TASK_PLACEHOLDER);

  newTask.append(descriptionSpan, removeButton, startButton, lemonSpan);
  taskList.append(newTask);

  descriptionSpan.addEventListener("click", editTask);

  tasks.push({ name: taskDescription, lemons: lemonCount });
  setTaskDescription(taskDescription);
  saveTasks();

  function getTaskIndex() {
    return Array.from(taskList.children).indexOf(newTask);
  }

  function removeTask() {
    newTask.remove();
    tasks.splice(getTaskIndex(), 1);
    saveTasks();
  }

  function editTask() {
    descriptionInput.value = taskDescription;
    descriptionSpan.replaceWith(descriptionInput);
    descriptionInput.focus();

    descriptionInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        setTaskDescription(descriptionInput.value);
        saveTasks();
      } else if (e.key === "Escape") {
        setTaskDescription(taskDescription);
      }
    });

    descriptionInput.addEventListener("blur", () => {
      setTaskDescription(descriptionInput.value);
      saveTasks();
    });
  }

  function setTaskDescription(val) {
    taskDescription = val;
    descriptionSpan.textContent = taskDescription || TASK_PLACEHOLDER;
    descriptionSpan.classList.toggle("placeholder", !taskDescription);
    descriptionInput.replaceWith(descriptionSpan);
    const taskIndex = getTaskIndex();
    tasks[taskIndex].name = taskDescription;
  }
}

addTaskButton.addEventListener("click", () => addTask());
renderTasks();
