// Smart Task Manager - Frontend JavaScript

// Configuration
const API_BASE_URL = 'http://localhost:8080/api';
const PYTHON_SERVICE_URL = 'http://localhost:5002';

// Global variables
let currentUser = null;
let authToken = null;
let allTasks = [];
let currentFilter = 'all';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    setupEventListeners();
    
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
        authToken = token;
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
        showUserSection();
        loadTasks();
    }
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', function(e) {
        applyFilters();
    });
    
    // Form submissions
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        login();
    });
    
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        register();
    });
    
    document.getElementById('taskForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveTask();
    });
}

// Authentication functions
async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            authToken = data.token;
            currentUser = data.user;
            
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showUserSection();
            hideModal('loginModal');
            loadTasks();
            showAlert('Login successful!', 'success');
        } else {
            const error = await response.json();
            showAlert(error.message || 'Login failed', 'danger');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Network error. Please try again.', 'danger');
    }
}

async function register() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        if (response.ok) {
            hideModal('registerModal');
            showAlert('Registration successful! Please login.', 'success');
            showLogin();
        } else {
            const error = await response.json();
            showAlert(error.message || 'Registration failed', 'danger');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('Network error. Please try again.', 'danger');
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    showAuthSection();
    clearTasks();
    showAlert('Logged out successfully', 'info');
}

// UI state management
function showUserSection() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('userSection').style.display = 'block';
    document.getElementById('userName').textContent = currentUser?.name || 'User';
}

function showAuthSection() {
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('userSection').style.display = 'none';
}

function checkAuthStatus() {
    if (!authToken) {
        showAuthSection();
    }
}

// Modal functions
function showLogin() {
    showModal('loginModal');
}

function showRegister() {
    showModal('registerModal');
}

function showAddTaskModal() {
    if (!authToken) {
        showAlert('Please login to add tasks', 'warning');
        return;
    }
    
    document.getElementById('taskModalTitle').textContent = 'Add New Task';
    document.getElementById('taskForm').reset();
    document.getElementById('taskId').value = '';
    document.getElementById('suggestionText').textContent = '';
    showModal('taskModal');
}

function showEditTaskModal(task) {
    document.getElementById('taskModalTitle').textContent = 'Edit Task';
    document.getElementById('taskId').value = task.id;
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description || '';
    document.getElementById('taskPriority').value = task.priority;
    
    if (task.deadline) {
        const deadline = new Date(task.deadline);
        document.getElementById('taskDeadline').value = deadline.toISOString().slice(0, 16);
    }
    
    showModal('taskModal');
}

function showModal(modalId) {
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();
}

function hideModal(modalId) {
    const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    if (modal) {
        modal.hide();
    }
}

// Task management functions
async function loadTasks() {
    if (!authToken) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            allTasks = await response.json();
            renderTasks();
            updateTaskCounts();
        } else {
            showAlert('Failed to load tasks', 'danger');
        }
    } catch (error) {
        console.error('Load tasks error:', error);
        showAlert('Network error loading tasks', 'danger');
    }
}

async function saveTask() {
    const taskId = document.getElementById('taskId').value;
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const deadline = document.getElementById('taskDeadline').value;
    const priority = document.getElementById('taskPriority').value;
    
    if (!title.trim()) {
        showAlert('Task title is required', 'warning');
        return;
    }
    
    const taskData = {
        title: title.trim(),
        description: description.trim(),
        priority,
        deadline: deadline ? new Date(deadline).toISOString() : null,
        isCompleted: false
    };
    
    try {
        const url = taskId ? `${API_BASE_URL}/tasks/${taskId}` : `${API_BASE_URL}/tasks`;
        const method = taskId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(taskData)
        });
        
        if (response.ok) {
            hideModal('taskModal');
            loadTasks();
            showAlert(taskId ? 'Task updated successfully!' : 'Task created successfully!', 'success');
        } else {
            const error = await response.json();
            showAlert(error.message || 'Failed to save task', 'danger');
        }
    } catch (error) {
        console.error('Save task error:', error);
        showAlert('Network error saving task', 'danger');
    }
}

async function toggleTaskComplete(taskId, isCompleted) {
    try {
        const task = allTasks.find(t => t.id === taskId);
        if (!task) return;
        
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                ...task,
                isCompleted: isCompleted
            })
        });
        
        if (response.ok) {
            loadTasks();
        } else {
            showAlert('Failed to update task', 'danger');
        }
    } catch (error) {
        console.error('Toggle task error:', error);
        showAlert('Network error updating task', 'danger');
    }
}

async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            loadTasks();
            showAlert('Task deleted successfully', 'success');
        } else {
            showAlert('Failed to delete task', 'danger');
        }
    } catch (error) {
        console.error('Delete task error:', error);
        showAlert('Network error deleting task', 'danger');
    }
}

// AI Priority Suggestion
async function getSuggestedPriority() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const deadline = document.getElementById('taskDeadline').value;
    
    if (!title.trim()) {
        showAlert('Please enter a task title first', 'warning');
        return;
    }
    
    const suggestionElement = document.getElementById('suggestionText');
    suggestionElement.innerHTML = '<span class="loading-spinner"></span> Getting AI suggestion...';
    
    try {
        const response = await fetch(`${PYTHON_SERVICE_URL}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                deadline: deadline ? new Date(deadline).toISOString() : null
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            document.getElementById('taskPriority').value = data.suggested_priority;
            suggestionElement.textContent = `AI suggests: ${data.suggested_priority} priority (${data.reason})`;
            suggestionElement.className = 'text-success ms-2';
        } else {
            suggestionElement.textContent = 'AI service unavailable';
            suggestionElement.className = 'text-warning ms-2';
        }
    } catch (error) {
        console.error('AI suggestion error:', error);
        suggestionElement.textContent = 'AI service unavailable';
        suggestionElement.className = 'text-warning ms-2';
    }
}

// Filtering and search
function filterTasks(filter) {
    currentFilter = filter;
    
    // Update active filter in sidebar
    document.querySelectorAll('.list-group-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.classList.add('active');
    
    applyFilters();
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const priorityFilter = document.getElementById('priorityFilter').value;
    
    let filteredTasks = allTasks;
    
    // Apply status filter
    if (currentFilter === 'completed') {
        filteredTasks = filteredTasks.filter(task => task.isCompleted);
    } else if (currentFilter === 'pending') {
        filteredTasks = filteredTasks.filter(task => !task.isCompleted);
    }
    
    // Apply priority filter
    if (priorityFilter) {
        filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
        filteredTasks = filteredTasks.filter(task => 
            task.title.toLowerCase().includes(searchTerm) ||
            (task.description && task.description.toLowerCase().includes(searchTerm))
        );
    }
    
    renderTasks(filteredTasks, searchTerm);
}

// Rendering functions
function renderTasks(tasks = allTasks, searchTerm = '') {
    const container = document.getElementById('tasksContainer');
    const emptyState = document.getElementById('emptyState');
    
    if (tasks.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    container.innerHTML = tasks.map(task => createTaskCard(task, searchTerm)).join('');
}

function createTaskCard(task, searchTerm = '') {
    const deadline = task.deadline ? new Date(task.deadline) : null;
    const now = new Date();
    let deadlineClass = 'deadline-normal';
    let deadlineText = 'No deadline';
    
    if (deadline) {
        const timeDiff = deadline - now;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        
        if (timeDiff < 0) {
            deadlineClass = 'deadline-warning';
            deadlineText = 'Overdue';
        } else if (daysDiff <= 1) {
            deadlineClass = 'deadline-warning';
            deadlineText = 'Due today';
        } else if (daysDiff <= 3) {
            deadlineClass = 'deadline-soon';
            deadlineText = `Due in ${daysDiff} days`;
        } else {
            deadlineText = deadline.toLocaleDateString();
        }
    }
    
    let title = task.title;
    let description = task.description || '';
    
    // Highlight search terms
    if (searchTerm) {
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        title = title.replace(regex, '<span class="search-highlight">$1</span>');
        description = description.replace(regex, '<span class="search-highlight">$1</span>');
    }
    
    return `
        <div class="card task-card ${task.isCompleted ? 'completed' : ''} fade-in">
            <div class="card-body">
                <div class="d-flex align-items-start justify-content-between">
                    <div class="d-flex align-items-start flex-grow-1">
                        <input type="checkbox" class="form-check-input task-checkbox" 
                               ${task.isCompleted ? 'checked' : ''} 
                               onchange="toggleTaskComplete('${task.id}', this.checked)">
                        <div class="flex-grow-1">
                            <h5 class="card-title task-title mb-1">${title}</h5>
                            ${description ? `<p class="card-text text-muted mb-2">${description}</p>` : ''}
                            <div class="d-flex align-items-center gap-3">
                                <span class="priority-badge priority-${task.priority.toLowerCase()}">${task.priority}</span>
                                <small class="${deadlineClass}">
                                    <i class="fas fa-clock me-1"></i>${deadlineText}
                                </small>
                            </div>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="btn-action" onclick="showEditTaskModal(${JSON.stringify(task).replace(/"/g, '&quot;')})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action btn-danger" onclick="deleteTask('${task.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function updateTaskCounts() {
    const allCount = allTasks.length;
    const pendingCount = allTasks.filter(task => !task.isCompleted).length;
    const completedCount = allTasks.filter(task => task.isCompleted).length;
    
    document.getElementById('allCount').textContent = allCount;
    document.getElementById('pendingCount').textContent = pendingCount;
    document.getElementById('completedCount').textContent = completedCount;
}

function clearTasks() {
    allTasks = [];
    document.getElementById('tasksContainer').innerHTML = '';
    document.getElementById('emptyState').style.display = 'block';
    updateTaskCounts();
}

// Utility functions
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}