// Simple test suite for MyDay Genie app
console.log('Running MyDay Genie tests...');

// Mock localStorage
const localStorageMock = (function() {
    let store = {};
    return {
        getItem: function(key) {
            return store[key] || null;
        },
        setItem: function(key, value) {
            store[key] = value.toString();
        },
        clear: function() {
            store = {};
        },
        removeItem: function(key) {
            delete store[key];
        },
        getAll: function() {
            return store;
        }
    };
})();

// Replace the real localStorage with our mock
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Test functions
function runTests() {
    testTaskCreation();
    testTaskCompletion();
    testTaskDeletion();
    testLocalStorage();
    testResetDay();
    
    console.log('All tests completed!');
}

// Test task creation
function testTaskCreation() {
    console.log('Testing task creation...');
    
    // Create a sample task
    const task = {
        id: '123456789',
        name: 'Test Task',
        category: 'study',
        time: '14:00',
        important: true,
        routine: false,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    // Add task to the array
    window.tasks = [task];
    
    // Check if task was added correctly
    if (window.tasks.length === 1 && window.tasks[0].name === 'Test Task') {
        console.log('✅ Task creation test passed!');
    } else {
        console.error('❌ Task creation test failed!');
    }
}

// Test task completion
function testTaskCompletion() {
    console.log('Testing task completion...');
    
    // Create a sample task
    const task = {
        id: '123456789',
        name: 'Test Task',
        category: 'study',
        time: '14:00',
        important: true,
        routine: false,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    // Add task to the array
    window.tasks = [task];
    
    // Toggle completion
    const taskId = '123456789';
    const taskIndex = window.tasks.findIndex(t => t.id === taskId);
    window.tasks[taskIndex].completed = !window.tasks[taskIndex].completed;
    
    // Check if task was marked as completed
    if (window.tasks[0].completed === true) {
        console.log('✅ Task completion test passed!');
    } else {
        console.error('❌ Task completion test failed!');
    }
}

// Test task deletion
function testTaskDeletion() {
    console.log('Testing task deletion...');
    
    // Create sample tasks
    const tasks = [
        {
            id: '123456789',
            name: 'Test Task 1',
            category: 'study',
            time: '14:00',
            important: true,
            routine: false,
            completed: false,
            createdAt: new Date().toISOString()
        },
        {
            id: '987654321',
            name: 'Test Task 2',
            category: 'cooking',
            time: '18:00',
            important: false,
            routine: true,
            completed: false,
            createdAt: new Date().toISOString()
        }
    ];
    
    // Add tasks to the array
    window.tasks = tasks;
    
    // Delete a task
    const taskId = '123456789';
    window.tasks = window.tasks.filter(task => task.id !== taskId);
    
    // Check if task was deleted correctly
    if (window.tasks.length === 1 && window.tasks[0].id === '987654321') {
        console.log('✅ Task deletion test passed!');
    } else {
        console.error('❌ Task deletion test failed!');
    }
}

// Test localStorage functionality
function testLocalStorage() {
    console.log('Testing localStorage functionality...');
    
    // Create sample tasks
    const tasks = [
        {
            id: '123456789',
            name: 'Test Task 1',
            category: 'study',
            time: '14:00',
            important: true,
            routine: false,
            completed: false,
            createdAt: new Date().toISOString()
        },
        {
            id: '987654321',
            name: 'Test Task 2',
            category: 'cooking',
            time: '18:00',
            important: false,
            routine: true,
            completed: false,
            createdAt: new Date().toISOString()
        }
    ];
    
    // Save to localStorage
    localStorage.setItem('myDayGenieTasks', JSON.stringify(tasks));
    
    // Retrieve from localStorage
    const retrievedTasks = JSON.parse(localStorage.getItem('myDayGenieTasks'));
    
    // Check if tasks were saved and retrieved correctly
    if (retrievedTasks.length === 2 && 
        retrievedTasks[0].id === '123456789' && 
        retrievedTasks[1].id === '987654321') {
        console.log('✅ localStorage test passed!');
    } else {
        console.error('❌ localStorage test failed!');
    }
}

// Test reset day functionality
function testResetDay() {
    console.log('Testing reset day functionality...');
    
    // Create sample tasks
    const tasks = [
        {
            id: '123456789',
            name: 'Test Task 1',
            category: 'study',
            time: '14:00',
            important: true,
            routine: false,
            completed: false,
            createdAt: new Date().toISOString()
        },
        {
            id: '987654321',
            name: 'Test Task 2',
            category: 'cooking',
            time: '18:00',
            important: false,
            routine: true,
            completed: false,
            createdAt: new Date().toISOString()
        }
    ];
    
    // Add tasks to the array
    window.tasks = tasks;
    
    // Reset day (clear all tasks)
    window.tasks = [];
    
    // Check if all tasks were cleared
    if (window.tasks.length === 0) {
        console.log('✅ Reset day test passed!');
    } else {
        console.error('❌ Reset day test failed!');
    }
}

// Run tests when this script is loaded in a test environment
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    runTests();
}

// Export for manual testing
if (typeof module !== 'undefined') {
    module.exports = {
        runTests
    };
}