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

// Immediately try to load data when the page opens
loadTasks();
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
// DRAG & DROP 
function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.priority}`;
        li.setAttribute('draggable', 'true');
        li.setAttribute('data-index', index);

        li.innerHTML = `
            <div>
                <strong>${task.title}</strong><br>
                <small>${task.date} | ${task.priority}</small>
            </div>
            <div class="actions">
                <button onclick="editTask(${task.id})">Edit</button>
                <button onclick="deleteTask(${task.id})" style="color:red">Delete</button>
            </div>
        `;

        //          DRAG AND DROP EVENT LISTENERS
        
        //start dragging
        li.addEventListener('dragstart', () => {
            draggedItemIndex = index;
            li.classList.add('dragging');
        });

        //Allow item to be dropped over this element

        li.addEventListener('dragover', (e) => {
            e.preventDefault(); // Necessary to allow drop
        });

        //handles the drop
        li.addEventListener('drop', () => {
            // Reorder the array based on where the item was dropped
            const movedItem = tasks.splice(draggedItemIndex, 1)[0];
            tasks.splice(index, 0, movedItem);
            
            saveAndRender(); // Save the new order permanently
        });

        //Clean up visual state
        li.addEventListener('dragend', () => {
            li.classList.remove('dragging');
        });

        taskList.appendChild(li);
    });
<<<<<<< HEAD
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
document.getElementById('sortPriorityBtn').addEventListener('click', sortByPriority);


=======


    // Shared task array
let tasks = [];

// Load tasks when page starts
window.onload = function () {
    tasks = loadTasks() || [];
    renderTasks();
};

// ADD TASK FUNCTION
function addTask() {
    // Read values from inputs
    const titleInput = document.getElementById("title");
    const priorityInput = document.getElementById("priority");
    const dateInput = document.getElementById("date");

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
    saveTasks(tasks);
    renderTasks();

    // Clear form
    titleInput.value = "";
    priorityInput.value = "";
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

// CONNECT BUTTON
document.getElementById("addBtn").addEventListener("click", addTask);
>>>>>>> 2abd116475453ca4008bb9e20731267cedb19b62
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
