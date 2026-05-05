//Task array declaration
let tasks = [];
let draggedItemIndex = null;

// Load tasks from LocalStorage immediately when script runs
const savedData = localStorage.getItem('myTasks');
if (savedData) {
    tasks = JSON.parse(savedData);
}

// Function to save current state to LocalStorage
function saveTasks() {
    localStorage.setItem('myTasks', JSON.stringify(tasks));
}
function loadTasks() {
    const savedData = localStorage.getItem('myTasks');

    if (savedData) {
        // Convert the string back into a JavaScript array
        tasks = JSON.parse(savedData);
        renderTasks(); // Call your function that draws the cards on the screen
    } else {
        tasks = []; // Start fresh if nothing is saved
    }
}

//===== RENDER FUNCTION
function renderTasks() {
  var list = document.getElementById('taskListSection');
  list.innerHTML = '';
  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i];
    var card = document.createElement('div');
    card.className = 'task-card';
    card.innerHTML = '<strong>' + task.title + '</strong>' +
      '<span class="badge ' + task.priority.toLowerCase() + '">' + task.priority + '</span>' +
      '<p>Due: ' + task.date + '</p>' +
      '<button onclick="editTask(' + task.id + ')">Edit</button>' +
      '<button onclick="deleteTask(' + task.id + ')">Delete</button>';
    makeDraggable(card, i);
    list.appendChild(card);
  }
}
// ADD TASK FUNCTION
function addTask(event) {
    // Prevent form submission default behavior
    if (event) {
        event.preventDefault();
    }
    
    // Read values from inputs
    const titleInput = document.getElementById("taskInput");
    const priorityInput = document.getElementById("prioritySelect");
    const dateInput = document.getElementById("dateInput");

    const title = titleInput.value.trim();
    const priority = priorityInput.value;
    const date = dateInput.value;

    // Validation
    if (title === "") {
        alert("Title cannot be empty!");
        return;
    }

    // Create task object
    const task = {
        id: Date.now(), // unique ID
        title: title,
        priority: priority,
        date: date
    };

    // Add to tasks array
    tasks.push(task);

    // Save and render
    saveTasks();
    renderTasks();

    // Clear form
    titleInput.value = "";
    priorityInput.value = "Medium";
    dateInput.value = "";
}

// DELETE TASK FUNCTION
function deleteTask(id) {
    // Remove task with matching ID
    tasks = tasks.filter(task => task.id !== id);

    // Save and re-render
    saveTasks(tasks);
    renderTasks();
}

function editTask(id) {
  var task = tasks.find(function(t) { return t.id === id; });
  if (!task) return;
  var newTitle = prompt('Edit task title:', task.title);
  if (newTitle === null) return;
  if (newTitle.trim() === '') newTitle = task.title;
  var newPriority = prompt('Edit priority (High / Medium / Low):', task.priority);
  if (newPriority === null) return;
  var newDate = prompt('Edit due date (YYYY-MM-DD):', task.date);
  if (newDate === null) return;
  task.title = newTitle;
  task.priority = newPriority;
  task.date = newDate;
  saveTasks();
  renderTasks();
}
    // 56. Sort tasks by due date (nearest first)
function sortByDate() {
    tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    renderTasks(); // 58. Re-render immediately
}

//  Sort tasks by priority (High → Medium → Low)
function sortByPriority() {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    renderTasks(); //  Re-render immediately
}
document.getElementById('sortDateBtn').addEventListener('click', sortByDate);
document.getElementById('sortPriorityBtn').addEventListener('click', 
    sortByPriority);

// DRAG & DROP — Ronoh Morgan 

var draggedIndex = null;

function makeDraggable(cardElement, index) {
  cardElement.setAttribute('draggable', true);
  cardElement.addEventListener('dragstart', function() {
    draggedIndex = index;
    cardElement.style.opacity = '0.5';
  });
  cardElement.addEventListener('dragend', function() {
    cardElement.style.opacity = '1';
  });
  cardElement.addEventListener('dragover', function(e) {
    e.preventDefault();
    cardElement.style.borderTop = '3px solid #2563EB';
  });
  cardElement.addEventListener('dragleave', function() {
    cardElement.style.borderTop = '';
  });
  cardElement.addEventListener('drop', function() {
    cardElement.style.borderTop = '';
    if (draggedIndex === null || draggedIndex === index) return;
    var moved = tasks.splice(draggedIndex, 1)[0];
    tasks.splice(index, 0, moved);
    draggedIndex = null;
    saveTasks();
    renderTasks();
  });
}


   // CONNECT BUTTON
document.getElementById("addTaskBtn").addEventListener("click", addTask);
document.getElementById("taskForm").addEventListener("submit", addTask);
loadTasks();
