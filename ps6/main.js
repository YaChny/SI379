// Load tasks from localStorage or initialize with an empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Timer state variables
// reference to the active timer
let countdownInterval = null;
// can be 'idle', 'work', or 'break'
let mode = 'idle';
// index of the task currently being timed
let currentTaskIndex = null;
// seconds for countdown
let seconds = 0;

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render all tasks
function renderTasks() {
    const container = document.getElementById('tasks');
    container.innerHTML = '';
    tasks.forEach((task, index) => {
    const div = document.createElement('div');
    div.className = 'task';

    // Task name input
    const input = document.createElement('input');
    input.type = 'text';
    input.value = task.name;
    input.onchange = () => { task.name = input.value; saveTasks(); };

    // Start timer button
    const startBtn = document.createElement('button');
    startBtn.textContent = 'Start';
    startBtn.addEventListener('click', () => startTimer(index));

    // Remove task button
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
        // Cancel timer if it's running for this task
        if (index === currentTaskIndex && countdownInterval) {
            cancelTimer();
        }
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    });

    // Lemon icon for completed sessions
    const lemons = document.createElement('span');
    lemons.className = 'lemons';
    lemons.textContent = '🍋'.repeat(task.sessions);

    // Append elements to task container
    div.appendChild(input);
    div.appendChild(startBtn);
    div.appendChild(removeBtn);
    div.appendChild(lemons);

    container.appendChild(div);
  });
}

// Adds a task
function addTask() {
    const taskInput = document.getElementById('new-task');
    const taskName = taskInput.value.trim();
    if (taskName) {
    tasks.push({ name: taskName, sessions: 0 });
    saveTasks();
    renderTasks();
    taskInput.value = '';
  }
}

// Starts the timer for a specific task
function startTimer(index) {
    // Prevent multiple timers
    if (countdownInterval) return;

    currentTaskIndex = index;
    const workMinutes = parseInt(document.getElementById('work-duration').value) || 25;
    const breakMinutes = parseInt(document.getElementById('break-duration').value) || 5;
    seconds = workMinutes * 60;
    mode = 'work';
    document.getElementById('cancel').classList.remove('hidden');

    // Initial tick render
    countdownTick();
    countdownInterval = setInterval(() => {
        seconds--;
        countdownTick();

        if (seconds <= 0) {
            clearInterval(countdownInterval);
            countdownInterval = null;

            if (mode === 'work') {
                // Complete work session
                tasks[currentTaskIndex].sessions += 1;
                saveTasks();
                renderTasks();

                // Start break session
                mode = 'break';
                seconds = breakMinutes * 60;
                countdownTick();
                countdownInterval = setInterval(() => {
                    seconds--;
                    countdownTick();
                    if (seconds <= 0) {
                        clearInterval(countdownInterval);
                        countdownInterval = null;
                        mode = 'idle';
                        document.getElementById('timer').textContent = '';
                        document.getElementById('cancel').classList.add('hidden');
                    }
                }, 1000);
            } else {
                // End break session
                mode = 'idle';
                document.getElementById('timer').textContent = '';
                document.getElementById('cancel').classList.add('hidden');
            }
        }
    }, 1000);
}

// Updates the countdown timer display
function countdownTick() { 
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    document.getElementById('timer').textContent = `${mode === 'work' ? 'Work' : 'Break'}: ${min}:${sec.toString().padStart(2, '0')}`;
}

// Cancels the current timer and resets to idle state
function cancelTimer() {
    clearInterval(countdownInterval);
    countdownInterval = null;
    mode = 'idle';
    document.getElementById('timer').textContent = '';
    document.getElementById('cancel').classList.add('hidden');
}

// Initialize the task list on page load
renderTasks();
