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


}
