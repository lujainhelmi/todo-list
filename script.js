// Initial items matching the lab screenshot
let todos = [
    { id: 1, text: 'See Lecture', completed: false },
    { id: 2, text: 'Solve assignment', completed: false }
];

let currentFilter = 'all';

const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const itemsLeft = document.getElementById('itemsLeft');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

// Render Todos to the DOM
function renderTodos() {
    todoList.innerHTML = '';
    
    // Filter logic
    let filteredTodos = todos.filter(todo => {
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true;
    });

    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = todo.completed ? 'completed' : '';
        li.setAttribute('data-id', todo.id);

        li.innerHTML = `
            <div class="todo-left">
                <input type="checkbox" ${todo.completed ? 'checked' : ''} class="toggle-checkbox">
                <span class="todo-text">${escapeHtml(todo.text)}</span>
            </div>
            <button class="delete-btn"><i class="fa-regular fa-trash-can"></i></button>
        `;

        // Double-click to edit feature
        const span = li.querySelector('.todo-text');
        span.addEventListener('dblclick', () => {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = todo.text;
            input.className = 'edit-input';
            
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && input.value.trim() !== '') {
                    todo.text = input.value.trim();
                    renderTodos();
                }
            });

            input.addEventListener('blur', () => {
                if (input.value.trim() !== '') {
                    todo.text = input.value.trim();
                }
                renderTodos();
            });

            span.replaceWith(input);
            input.focus();
        });

        todoList.appendChild(li);
    });

    updateItemsLeft();
}

// Update items counter summary
function updateItemsLeft() {
    const activeCount = todos.filter(t => !t.completed).length;
    itemsLeft.textContent = `${activeCount} item${activeCount === 1 ? '' : 's'} left`;
}

// Add new todo function
function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') return;

    todos.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    todoInput.value = '';
    renderTodos();
}

// Event Listeners for adding items
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTodo();
});

// Event Delegation for handling list interactions (Checking & Deleting)
todoList.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    const id = Number(li.getAttribute('data-id'));

    // Toggle Checkbox state
    if (e.target.classList.contains('toggle-checkbox')) {
        const todo = todos.find(t => t.id === id);
        if (todo) {
            todo.completed = e.target.checked;
            renderTodos();
        }
    }

    // Delete item when clicking trash can
    if (e.target.closest('.delete-btn')) {
        todos = todos.filter(t => t.id !== id);
        renderTodos();
    }
});

// Filter tabs event handling
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderTodos();
    });
});

// Clear buttons
clearCompletedBtn.addEventListener('click', () => {
    todos = todos.filter(t => !t.completed);
    renderTodos();
});

clearAllBtn.addEventListener('click', () => {
    todos = [];
    renderTodos();
});

// Security helper to prevent HTML injection attacks
function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Initial render call on page load
renderTodos();
