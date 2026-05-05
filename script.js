//Task array declaration
let tasks = [];
let draggedItemIndex = null;

// Load tasks from LocalStorage immediately when script runs
const savedData = localStorage.getItem('myTasks');
if (savedData) {//Task array declaration
let tasks = [];
let draggedItemIndex = null;
let currentEditingTaskId = null;

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
  var list = document.getElementById('taskList');
  list.innerHTML = '';
  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i];
    var card = document.createElement('div');
    card.className = 'task-card ' + task.priority.toLowerCase();
    
    // Format date for display
    var dateDisplay = task.date ? new Date(task.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date';
    
    card.innerHTML = '<strong>' + task.title + '</strong>' +
      '<span class="badge ' + task.priority.toLowerCase() + '">' + task.priority + ' Priority</span>' +
      '<p>Due: ' + dateDisplay + '</p>' +
      '<div class="task-actions">' +
      '<button onclick="openEditModal(' + task.id + ')">Edit</button>' +
      '<button onclick="deleteTask(' + task.id + ')">Delete</button>' +
      '</div>';
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

// OPEN EDIT MODAL
function openEditModal(id) {
  var task = tasks.find(function(t) { return t.id === id; });
  if (!task) return;
  
  currentEditingTaskId = id;
  document.getElementById('editTitle').value = task.title;
  document.getElementById('editPriority').value = task.priority;
  document.getElementById('editDate').value = task.date;
  
  document.getElementById('editModal').style.display = 'block';
}

// CLOSE MODAL
function closeEditModal() {
  document.getElementById('editModal').style.display = 'none';
  currentEditingTaskId = null;
}

// SAVE EDITED TASK
function saveEditedTask() {
  if (currentEditingTaskId === null) return;
  
  var task = tasks.find(function(t) { return t.id === currentEditingTaskId; });
  if (!task) return;
  
  const newTitle = document.getElementById('editTitle').value.trim();
  const newPriority = document.getElementById('editPriority').value;
  const newDate = document.getElementById('editDate').value;
  
  // Validation
  if (newTitle === "") {
    alert("Title cannot be empty!");
    return;
  }
  
  task.title = newTitle;
  task.priority = newPriority;
  task.date = newDate;
  
  saveTasks();
  renderTasks();
  closeEditModal();
}

// Sort tasks by due date (nearest first)
function sortByDate() {
    tasks.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(a.date) - new Date(b.date);
    });
    renderTasks();
}

// Sort tasks by priority (High → Medium → Low)
function sortByPriority() {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    renderTasks();
}

// DRAG & DROP
var draggedIndex = null;

function makeDraggable(cardElement, index) {
  cardElement.setAttribute('draggable', true);
  cardElement.style.cursor = 'grab';
  
  cardElement.addEventListener('dragstart', function(e) {
    draggedIndex = index;
    cardElement.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', cardElement.innerHTML);
  });
  
  cardElement.addEventListener('dragend', function() {
    cardElement.classList.remove('dragging');
    cardElement.style.borderTop = '';
  });
  
  cardElement.addEventListener('dragover', function(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedIndex !== index) {
      cardElement.style.borderTop = '3px solid #667eea';
      cardElement.style.paddingTop = '10px';
    }
  });
  
  cardElement.addEventListener('dragleave', function() {
    cardElement.style.borderTop = '';
    cardElement.style.paddingTop = '18px';
  });
  
  cardElement.addEventListener('drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
    cardElement.style.borderTop = '';
    cardElement.style.paddingTop = '18px';
    
    if (draggedIndex === null || draggedIndex === index) return;
    
    var moved = tasks.splice(draggedIndex, 1)[0];
    tasks.splice(index, 0, moved);
    draggedIndex = null;
    saveTasks();
    renderTasks();
  });
}

// MODAL EVENT LISTENERS
var modal = document.getElementById('editModal');
var closeBtn = document.querySelector('.close');
var saveBtn = document.getElementById('saveEditBtn');
var cancelBtn = document.getElementById('cancelEditBtn');

closeBtn.addEventListener('click', closeEditModal);
saveBtn.addEventListener('click', saveEditedTask);
cancelBtn.addEventListener('click', closeEditModal);

// Close modal when clicking outside of it
window.addEventListener('click', function(event) {
  if (event.target == modal) {
    closeEditModal();
  }
});

// BUTTON EVENT LISTENERS
document.getElementById('sortDateBtn').addEventListener('click', sortByDate);
document.getElementById('sortPriorityBtn').addEventListener('click', sortByPriority);
document.getElementById("addTaskBtn").addEventListener("click", addTask);
document.getElementById("taskForm").addEventListener("submit", addTask);

// Load tasks on page load
loadTasks();

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
