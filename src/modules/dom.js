import Project from './project';
import Todo from './todo';
import logo from '../assets/vector-square-plus.png';
import { saveProjects } from './storage';
import { format } from 'date-fns';

let currentActiveProject = null;

let currentSort = 'default';

let currentView = 'project';

let editingTodo = null;

const overlay = document.getElementById('overlay');
const taskModal = document.getElementById('task-modal');
const taskForm = document.getElementById('task-form');
const content = document.getElementById('content');
const modal = document.getElementById('project-modal');
const projectForm = document.getElementById('project-form');

projectForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const projectName = document.getElementById('project-name').value;

    const newProject = new Project(projectName);

    currentProjects.push(newProject);

    saveProjects(currentProjects);

    renderProjects(currentProjects, newProject);

    modal.classList.add('hidden');

    overlay.classList.add('hidden');

    projectForm.reset();
});

overlay.addEventListener('click', () => {
    modal.classList.add('hidden');

    taskModal.classList.add('hidden');

    overlay.classList.add('hidden');
});

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const todoTitle = document.getElementById('todo-title').value;
    const todoDescription = document.getElementById('todo-description').value;
    const todoDate = document.getElementById('todo-date').value;
    const todoPriority = document.getElementById('todo-priority').value;

    if (!currentActiveProject) return;

    if (editingTodo) {
        editingTodo.title = todoTitle;
        editingTodo.description = todoDescription;
        editingTodo.dueDate = todoDate;
        editingTodo.priority = todoPriority;

    editingTodo = null;
    } else {
        const newTodo = new Todo(
            todoTitle,
            todoDescription,
            todoDate,
            todoPriority
        );

        currentActiveProject.addTodo(newTodo);
    }

    saveProjects(currentProjects);

    renderProjects(currentProjects, currentActiveProject);

    taskModal.classList.add('hidden');

    overlay.classList.add('hidden');

    taskForm.reset();
});

let currentProjects = [];

function renderProjects(projects, activeProject) {
    currentProjects = projects;
    currentView = 'project';

    content.innerHTML = '';

    currentActiveProject = activeProject;

    renderProjectList(projects, activeProject);

    if (!activeProject) return;

    const addTaskBtn = document.createElement('button');

    addTaskBtn.textContent = 'Add Task';

    addTaskBtn.addEventListener('click', () => {
        editingTodo = null;

        taskForm.reset();

    taskModal.classList.remove('hidden');

    overlay.classList.remove('hidden');
});



    const projectDiv = document.createElement('div');
    projectDiv.classList.add('project');

    const title = document.createElement('h2');
    title.textContent = activeProject.name;

    const deleteProjectBtn = document.createElement('button');
    deleteProjectBtn.textContent = 'Delete Project';
    deleteProjectBtn.addEventListener('click', () => {
        const projectIndex = projects.indexOf(activeProject);

        projects.splice(projectIndex, 1);

        saveProjects(projects);

        if (projects.length === 0) {
            currentActiveProject = null;

            saveProjects(projects);
            
            content.innerHTML = '';
            renderProjectList(projects, null);

            return;
        }

        renderProjects(projects, projects[0]);
    });

    const headerDiv = document.createElement('div');
    headerDiv.classList.add('project-header');

    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('project-actions');

    const sortSelect = document.createElement('select');

    sortSelect.innerHTML = `
    <option value="default">Default</option>
    <option value="dueDate">Due Date</option>
    <option value="priority">Priority</option>
    <option value="overdue">Overdue First</option>
    `;

    sortSelect.value = currentSort;

    sortSelect.addEventListener('change', () => {
        currentSort = sortSelect.value;

        renderProjects(projects, activeProject);
    });

    actionsDiv.append(sortSelect, addTaskBtn, deleteProjectBtn);

    headerDiv.append(title, actionsDiv);

    projectDiv.appendChild(headerDiv);

    const todoGrid = document.createElement('div');
    todoGrid.classList.add('todo-grid');

    projectDiv.appendChild(todoGrid);

    renderTodos(activeProject, todoGrid, projects);

    content.appendChild(projectDiv);
}

function renderSingleTodo(
    todo,
    project,
    container,
    projects
) {
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo-card');

    if (todo.completed) {
        todoDiv.classList.add('completed');
    }

    const title = document.createElement('h3');
    title.textContent = todo.title;

    const description = document.createElement('p');
    description.textContent = todo.description;

    const dueDate = document.createElement('p');

    let formattedDate = 'No Due Date'

    if (
        todo.dueDate &&
        !isNaN(new Date(todo.dueDate))
    ) {
        formattedDate = format(
            new Date(todo.dueDate),
            'MMM-dd-yyyy'
        );
    }

    dueDate.textContent = `Due: ${formattedDate}`;

    if (
        todo.dueDate &&
        new Date(todo.dueDate) < new Date() &&
        !todo.completed
    ) {
        dueDate.classList.add('overdue');
    }

    const priority = document.createElement('p');
    priority.textContent = `Priorirty: ${todo.priority}`;

    priority.classList.add(
        `priority-${todo.priority.toLowerCase()}`
    );

    todoDiv.classList.add(
        todo.priority.toLowerCase()
    );

    const status = document.createElement('p');
    status.textContent = todo.completed
        ? 'Completed'
        : 'Not Completed';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';

    deleteBtn.addEventListener('click', () => {
        const index = project.todos.indexOf(todo);

        project.todos.splice(index, 1);

        saveProjects(projects);

        renderProjects(projects, project);
    });

    const completeBtn = document.createElement('button');
    completeBtn.textContent = 'Complete';

    completeBtn.addEventListener('click', () => {
        todo.completed = !todo.completed;

        saveProjects(projects);

        if (currentView === 'today') {
            renderTodayView(projects);
        } else if (currentView === 'overdue') {
            renderOverdueView(projects);
        } else {
            renderProjects(projects, project);
        }
    });

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';

    editBtn.addEventListener('click', () => {
        editingTodo = todo;

        document.getElementById('todo-title').value = todo.title;

        document.getElementById('todo-description').value = todo.description;

        document.getElementById('todo-date').value = todo.dueDate;

        document.getElementById('todo-priority').value = todo.priority;

        taskModal.classList.remove('hidden');
        overlay.classList.remove('hidden');
    });

    const cardActions = document.createElement('div');
    cardActions.classList.add('todo-actions');

    cardActions.append(
        completeBtn,
        editBtn,
        deleteBtn
    );

    todoDiv.append(
        title,
        description,
        dueDate,
        priority,
        status,
        cardActions
    );

    container.appendChild(todoDiv);
}

function renderTodayView(projects) {
    content.innerHTML = '';

    const title = document.createElement('h2');
    title.textContent = 'Today';

    content.appendChild(title);

    const todoGrid = document.createElement('div');
    todoGrid.classList.add('todo-grid');

    content.appendChild(todoGrid);

    const today = new Date().toISOString().split('T')[0];

    projects.forEach((project) => {
        project.todos.forEach((todo) => {
            if (
                todo.dueDate === today && !todo.completed
            ) {
                renderSingleTodo(
                    todo,
                    project,
                    todoGrid,
                    projects
                );
            }
        });
    });
};

function renderOverdueView(projects) {
    content.innerHTML = '';

    const title = document.createElement('h2');
    title.textContent = 'Overdue';

    content.appendChild(title);

    const todoGrid = document.createElement('div');
    todoGrid.classList.add('todo-grid');

    content.appendChild(todoGrid);

    const todayString = new Date().toISOString().split('T')[0];

    projects.forEach((project) => {
        project.todos.forEach((todo) => {
            if (
                todo.dueDate &&
                todo.dueDate < todayString &&
                !todo.completed
            ) {
                renderSingleTodo(
                    todo,
                    project,
                    todoGrid,
                    projects
                );
            }
        });
    });
}

function renderTodos(project, container, projects) {
    if (!project.todos) {
        console.error('Project has no todos array');
        return;
    }

    let todosToRender = [...project.todos];

    if (currentSort === 'dueDate') {
        todosToRender.sort((a, b) => {
            const aDate = a.dueDate
                ? new Date(a.dueDate)
                : new Date('9999-12-31');

            const bDate = b.dueDate
                ? new Date(b.dueDate)
                : new Date('9999-12-31');

            return aDate - bDate;
        });
    }

    const priorityOrder = {
        High: 3,
        Medium: 2,
        Low: 1
    };

    if (currentSort === 'priority') {
        todosToRender.sort((a, b) => {
            return priorityOrder[b.priority] - priorityOrder[a.priority]
        });
    }

    if (currentSort === 'overdue') {
        todosToRender.sort((a, b) => {
            const today = new Date();
                
            const aOverdue = a.dueDate && new Date(a.dueDate) < today;

            const bOverdue = b.dueDate && new Date(b.dueDate) < today;

            return bOverdue - aOverdue;
        });
    }

    todosToRender.forEach((todo) => {
        renderSingleTodo(
            todo,
            project,
            container,
            projects
        );
    });
}

const sidebar = document.getElementById('sidebar');

function renderProjectList(projects, activeProject) {
    sidebar.innerHTML = '';

    const logoContainer = document.createElement('div');
    logoContainer.classList.add('sidebar-header');

    const logoImg = document.createElement('img');
    logoImg.src = logo;
    logoImg.alt = 'VP Todo Logo';
    logoImg.classList.add('sidebar-logo');

    const appTitle = document.createElement('h2');
    appTitle.textContent = '+VP Todo+';

    logoContainer.append(logoImg, appTitle);

    sidebar.appendChild(logoContainer);

    const todayBtn = document.createElement('button');
    todayBtn.textContent = 'Today';

    todayBtn.addEventListener('click', () => {
        currentView = 'today';
        renderTodayView(currentProjects);
    });

    sidebar.appendChild(todayBtn);

    const overdueBtn = document.createElement('button');
    overdueBtn.textContent = 'Overdue';

    overdueBtn.addEventListener('click', () => {
        currentView = 'overdue';
        renderOverdueView(currentProjects);
    });

    sidebar.appendChild(overdueBtn);

    projects.forEach((project) => {
        const projectBtn = document.createElement('button');

        if (currentView === 'today') {
            todayBtn.classList.add('active');
        }
        if (currentView === 'overdue') {
            overdueBtn.classList.add('active');
        }

        if (
            currentView === 'project' &&
            project === activeProject
        ) {
            projectBtn.classList.add('active');
        }

        projectBtn.classList.add('project-btn');
        projectBtn.textContent = `${project.name} (${project.todos.length})`;

        projectBtn.title = `${project.name} (${project.todos.length})`;

        projectBtn.addEventListener('click', () => {
            currentView = 'project';
            renderProjects(projects, project);
        });

        sidebar.appendChild(projectBtn);
    });

        const addProjectBtn = document.createElement('button');
        addProjectBtn.classList.add('add-project-btn');

        addProjectBtn.textContent = 'Add Project';

        addProjectBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');

            overlay.classList.remove('hidden');

            projectForm.reset();
        });

    sidebar.appendChild(addProjectBtn);
    }

export default renderProjects;