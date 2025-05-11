# MyDay Genie - Developer Documentation

This document provides technical details about the MyDay Genie application, its architecture, and guidance for developers who want to extend or modify it.

## Application Architecture

MyDay Genie follows a simple frontend architecture with the following components:

1. **HTML (index.html)**: Provides the structure and UI elements
2. **CSS (styles.css)**: Handles styling and visual presentation
3. **JavaScript (app.js)**: Implements the application logic and functionality

### Data Model

Tasks are represented as JavaScript objects with the following properties:

```javascript
{
  id: String,           // Unique identifier (timestamp)
  name: String,         // Task name
  category: String,     // Task category (cooking, cleaning, study, etc.)
  time: String,         // Time in 24-hour format (HH:MM)
  important: Boolean,   // Whether the task is marked as important
  routine: Boolean,     // Whether the task is a routine task
  completed: Boolean,   // Whether the task is completed
  createdAt: String     // ISO timestamp of when the task was created
}
```

### State Management

The application uses a simple state management approach:

- Tasks are stored in a global `tasks` array
- The `currentView` variable tracks the current view mode ('time' or 'category')
- LocalStorage is used for persistence between sessions

### Core Functions

#### Task Management

- `handleTaskFormSubmit(e)`: Creates and adds a new task
- `toggleTaskCompletion(taskId)`: Marks a task as complete/incomplete
- `deleteTask(taskId)`: Removes a task
- `handleResetDay()`: Clears all tasks

#### Rendering

- `renderTasks()`: Main rendering function that delegates to specific view renderers
- `renderTasksByTime()`: Groups and displays tasks by time
- `renderTasksByCategory()`: Groups and displays tasks by category
- `createTaskElement(task)`: Creates a DOM element for a single task

#### Storage

- `loadTasksFromLocalStorage()`: Loads tasks from localStorage
- `saveTasksToLocalStorage()`: Saves tasks to localStorage

## Extending the Application

### Adding a New Feature

To add a new feature to MyDay Genie:

1. **Understand the existing code**: Familiarize yourself with the current implementation
2. **Plan your changes**: Determine what HTML, CSS, and JavaScript changes are needed
3. **Implement the feature**: Make the necessary changes
4. **Test thoroughly**: Ensure your changes work as expected and don't break existing functionality
5. **Update documentation**: Document your changes

### Example: Adding Task Priority Levels

Here's how you might add priority levels beyond just "Important":

1. **HTML Changes**:
   - Replace the "Important" checkbox with a priority dropdown
   ```html
   <div class="form-group">
       <label for="task-priority">Priority:</label>
       <select id="task-priority" required>
           <option value="low">Low</option>
           <option value="medium" selected>Medium</option>
           <option value="high">High</option>
       </select>
   </div>
   ```

2. **CSS Changes**:
   - Add styles for different priority levels
   ```css
   .task-item.priority-low { border-left-color: #6c757d; }
   .task-item.priority-medium { border-left-color: #ffc107; }
   .task-item.priority-high { border-left-color: #dc3545; }
   ```

3. **JavaScript Changes**:
   - Update the task object structure
   - Modify the task creation logic
   - Update the rendering functions

### Example: Adding Dark Mode

To add a dark/light mode toggle:

1. **HTML Changes**:
   - Add a toggle button in the header
   ```html
   <button id="theme-toggle" class="theme-toggle">
       <i class="fas fa-moon"></i>
   </button>
   ```

2. **CSS Changes**:
   - Define dark mode variables
   ```css
   :root {
       /* Light mode variables */
   }
   
   [data-theme="dark"] {
       /* Dark mode variables */
       --primary-color: #9370db;
       --light-color: #343a40;
       --dark-color: #f8f9fa;
       /* etc. */
   }
   ```

3. **JavaScript Changes**:
   - Add theme toggle functionality
   ```javascript
   const themeToggle = document.getElementById('theme-toggle');
   themeToggle.addEventListener('click', () => {
       const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
       const newTheme = currentTheme === 'light' ? 'dark' : 'light';
       document.documentElement.setAttribute('data-theme', newTheme);
       localStorage.setItem('theme', newTheme);
       
       // Update icon
       const icon = themeToggle.querySelector('i');
       icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
   });
   
   // Load saved theme
   const savedTheme = localStorage.getItem('theme');
   if (savedTheme) {
       document.documentElement.setAttribute('data-theme', savedTheme);
       const icon = themeToggle.querySelector('i');
       icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
   }
   ```

## Testing

The application includes a simple test suite in `tests.js` that can be run using `test.html`. The tests cover:

- Task creation
- Task completion
- Task deletion
- LocalStorage functionality
- Reset day functionality

To add new tests:

1. Create a new test function in `tests.js`
2. Add your test function to the `runTests()` function
3. Run the tests using `test.html`

## Best Practices

When working on this codebase, please follow these best practices:

1. **Keep it simple**: Maintain the simplicity of the application
2. **Comment your code**: Add comments to explain complex logic
3. **Use consistent naming**: Follow the existing naming conventions
4. **Test thoroughly**: Ensure your changes work as expected
5. **Update documentation**: Keep this documentation up to date

## Future Roadmap

Potential enhancements for future versions:

1. **Task reminders**: Add browser notifications for upcoming tasks
2. **Drag-and-drop**: Allow reordering tasks via drag-and-drop
3. **Dark/light mode**: Add theme support
4. **Weekly view**: Expand to multi-day planning
5. **Task recurrence**: Add support for recurring tasks
6. **Data export/import**: Allow backing up and restoring tasks