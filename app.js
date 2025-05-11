// DOM Elements
const taskForm = document.getElementById('task-form');
const taskNameInput = document.getElementById('task-name');
const taskCategorySelect = document.getElementById('task-category');
const taskTimeInput = document.getElementById('task-time');
const taskImportantCheckbox = document.getElementById('task-important');
const taskRoutineCheckbox = document.getElementById('task-routine');
const tasksContainer = document.getElementById('tasks-container');
const resetDayButton = document.getElementById('reset-day');
const viewByTimeButton = document.getElementById('view-by-time');
const viewByCategoryButton = document.getElementById('view-by-category');

// App State
let tasks = [];
let currentView = 'time'; // 'time' or 'category'

// Initialize the app
function init() {
    loadTasksFromLocalStorage();
    renderTasks();
    setupEventListeners();
}

// Load tasks from localStorage
function loadTasksFromLocalStorage() {
    const savedTasks = localStorage.getItem('myDayGenieTasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}

// Save tasks to localStorage
function saveTasksToLocalStorage() {
    localStorage.setItem('myDayGenieTasks', JSON.stringify(tasks));
}

// Setup Event Listeners
function setupEventListeners() {
    // Form submission
    taskForm.addEventListener('submit', handleTaskFormSubmit);
    
    // Reset day button
    resetDayButton.addEventListener('click', handleResetDay);
    
    // View toggle buttons
    viewByTimeButton.addEventListener('click', () => {
        currentView = 'time';
        viewByTimeButton.classList.add('active');
        viewByCategoryButton.classList.remove('active');
        renderTasks();
    });
    
    viewByCategoryButton.addEventListener('click', () => {
        currentView = 'category';
        viewByCategoryButton.classList.add('active');
        viewByTimeButton.classList.remove('active');
        renderTasks();
    });
}

// Handle task form submission
function handleTaskFormSubmit(e) {
    e.preventDefault();
    
    // Create new task object
    const newTask = {
        id: Date.now().toString(),
        name: taskNameInput.value,
        category: taskCategorySelect.value,
        time: taskTimeInput.value,
        important: taskImportantCheckbox.checked,
        routine: taskRoutineCheckbox.checked,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    // Add task to array
    tasks.push(newTask);
    
    // Save to localStorage
    saveTasksToLocalStorage();
    
    // Reset form
    taskForm.reset();
    
    // Render tasks
    renderTasks();
    
    // Show confirmation
    showNotification('Task added successfully!');
}

// Handle reset day
function handleResetDay() {
    if (confirm('Are you sure you want to clear all tasks for a new day?')) {
        tasks = [];
        saveTasksToLocalStorage();
        renderTasks();
        showNotification('All tasks cleared for a new day!');
    }
}

// Render tasks based on current view
function renderTasks() {
    // Clear container
    tasksContainer.innerHTML = '';
    
    // Check if there are no tasks
    if (tasks.length === 0) {
        tasksContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tasks"></i>
                <p>No tasks added yet. Start planning your day!</p>
            </div>
        `;
        return;
    }
    
    // Render based on current view
    if (currentView === 'time') {
        renderTasksByTime();
    } else {
        renderTasksByCategory();
    }
}

// Render tasks grouped by time
function renderTasksByTime() {
    // Sort tasks by time
    const sortedTasks = [...tasks].sort((a, b) => {
        return a.time.localeCompare(b.time);
    });
    
    // Group tasks by hour
    const tasksByHour = {};
    
    sortedTasks.forEach(task => {
        const hour = task.time.split(':')[0];
        if (!tasksByHour[hour]) {
            tasksByHour[hour] = [];
        }
        tasksByHour[hour].push(task);
    });
    
    // Render each time group
    Object.keys(tasksByHour).sort().forEach(hour => {
        // Create time header
        const timeHeader = document.createElement('div');
        timeHeader.className = 'time-group-header';
        
        // Format the hour for display (12-hour format)
        const hourNum = parseInt(hour);
        const amPm = hourNum >= 12 ? 'PM' : 'AM';
        const displayHour = hourNum > 12 ? hourNum - 12 : (hourNum === 0 ? 12 : hourNum);
        
        timeHeader.innerHTML = `<i class="fas fa-clock"></i> ${displayHour}:00 ${amPm}`;
        tasksContainer.appendChild(timeHeader);
        
        // Render tasks for this hour
        tasksByHour[hour].forEach(task => {
            tasksContainer.appendChild(createTaskElement(task));
        });
    });
}

// Render tasks grouped by category
function renderTasksByCategory() {
    // Group tasks by category
    const tasksByCategory = {};
    
    tasks.forEach(task => {
        if (!tasksByCategory[task.category]) {
            tasksByCategory[task.category] = [];
        }
        tasksByCategory[task.category].push(task);
    });
    
    // Render each category group
    const categoryOrder = ['cooking', 'cleaning', 'study', 'assignment', 'personal', 'other'];
    
    categoryOrder.forEach(category => {
        if (tasksByCategory[category] && tasksByCategory[category].length > 0) {
            // Create category header
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'category-group-header';
            
            // Set icon based on category
            let icon;
            switch(category) {
                case 'cooking': icon = 'fa-utensils'; break;
                case 'cleaning': icon = 'fa-broom'; break;
                case 'study': icon = 'fa-book'; break;
                case 'assignment': icon = 'fa-pencil-alt'; break;
                case 'personal': icon = 'fa-user'; break;
                default: icon = 'fa-tasks';
            }
            
            // Capitalize first letter of category
            const displayCategory = category.charAt(0).toUpperCase() + category.slice(1);
            
            categoryHeader.innerHTML = `<i class="fas ${icon}"></i> ${displayCategory}`;
            tasksContainer.appendChild(categoryHeader);
            
            // Sort tasks by time within category
            const sortedCategoryTasks = [...tasksByCategory[category]].sort((a, b) => {
                return a.time.localeCompare(b.time);
            });
            
            // Render tasks for this category
            sortedCategoryTasks.forEach(task => {
                tasksContainer.appendChild(createTaskElement(task));
            });
        }
    });
}

// Create task element
function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = `task-item ${task.category}`;
    
    if (task.important) taskElement.classList.add('important');
    if (task.routine) taskElement.classList.add('routine');
    if (task.completed) taskElement.classList.add('completed');
    
    // Format time for display (12-hour format)
    const [hours, minutes] = task.time.split(':');
    const hourNum = parseInt(hours);
    const amPm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum > 12 ? hourNum - 12 : (hourNum === 0 ? 12 : hourNum);
    const formattedTime = `${displayHour}:${minutes} ${amPm}`;
    
    // Set icon based on category
    let categoryIcon;
    switch(task.category) {
        case 'cooking': categoryIcon = 'fa-utensils'; break;
        case 'cleaning': categoryIcon = 'fa-broom'; break;
        case 'study': categoryIcon = 'fa-book'; break;
        case 'assignment': categoryIcon = 'fa-pencil-alt'; break;
        case 'personal': categoryIcon = 'fa-user'; break;
        default: categoryIcon = 'fa-tasks';
    }
    
    taskElement.innerHTML = `
        <div class="task-content">
            <h3>${task.name}</h3>
            <div class="task-meta">
                <span><i class="fas fa-clock"></i> ${formattedTime}</span>
                <span><i class="fas ${categoryIcon}"></i> ${task.category.charAt(0).toUpperCase() + task.category.slice(1)}</span>
                ${task.important ? '<span><i class="fas fa-exclamation-circle"></i> Important</span>' : ''}
                ${task.routine ? '<span><i class="fas fa-redo"></i> Routine</span>' : ''}
            </div>
        </div>
        <div class="task-actions">
            <button class="complete-btn" title="Mark as ${task.completed ? 'incomplete' : 'complete'}">
                <i class="fas ${task.completed ? 'fa-undo' : 'fa-check-circle'}"></i>
            </button>
            <button class="delete-btn" title="Delete task">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // Add event listeners to buttons
    const completeBtn = taskElement.querySelector('.complete-btn');
    const deleteBtn = taskElement.querySelector('.delete-btn');
    
    completeBtn.addEventListener('click', () => {
        toggleTaskCompletion(task.id);
    });
    
    deleteBtn.addEventListener('click', () => {
        deleteTask(task.id);
    });
    
    return taskElement;
}

// Toggle task completion status
function toggleTaskCompletion(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasksToLocalStorage();
        renderTasks();
    }
}

// Delete task
function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasksToLocalStorage();
        renderTasks();
        showNotification('Task deleted successfully!');
    }
}

// Show notification
function showNotification(message) {
    // Check if notification container exists
    let notificationContainer = document.querySelector('.notification-container');
    
    // Create if it doesn't exist
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
        
        // Add styles
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.bottom = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '1000';
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style notification
    notification.style.backgroundColor = 'var(--primary-color)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = 'var(--border-radius)';
    notification.style.marginTop = '10px';
    notification.style.boxShadow = 'var(--box-shadow)';
    notification.style.transition = 'var(--transition)';
    notification.style.opacity = '0';
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);