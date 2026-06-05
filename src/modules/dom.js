import Project from './project';
import Todo from './todo';
import { saveProjects } from './storage';
import { format } from 'date-fns';

let currentActiveProject = null;

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

    actionsDiv.append(deleteProjectBtn, addTaskBtn);

    headerDiv.append(title, actionsDiv);

    projectDiv.appendChild(headerDiv);

    const todoGrid = document.createElement('div');
    todoGrid.classList.add('todo-grid');

    projectDiv.appendChild(todoGrid);

    renderTodos(activeProject, todoGrid, projects);

    content.appendChild(projectDiv);
}

function renderTodos(project, container, projects) {
    if (!project.todos) {
        console.error('Project has no todos array');
        return;
    }
    project.todos.forEach((todo, todoIndex) => {
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo-card');

        if (todo.completed) {
            todoDiv.classList.add('completed');
        }

        const title = document.createElement('h3');
        title.textContent = todo.title;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            project.todos.splice(todoIndex, 1);

            saveProjects(projects);

            renderProjects(currentProjects, project);
        });

        const completeBtn = document.createElement('button');
        completeBtn.textContent = 'Complete';
        completeBtn.addEventListener('click', () => {
            todo.completed = !todo.completed;

            saveProjects(projects);

            renderProjects(projects, project);
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


        const description = document.createElement('p');
        description.textContent = todo.description;

        const dueDate = document.createElement('p');

        let formattedDate = 'No Due Date';

        if (
            todo.dueDate && !isNaN(new Date(todo.dueDate))
        ) {
            formattedDate = format(
                new Date(todo.dueDate),
                'MMM-dd-yyyy'
            );
        }

        dueDate.textContent = `Due: ${formattedDate}`;

        const priority = document.createElement('p');
        priority.textContent = `Priority: ${todo.priority}`;

        priority.classList.add(`priority-${todo.priority.toLowerCase()}`);

        todoDiv.classList.add(todo.priority.toLowerCase());
        
        const status = document.createElement('p');
        status.textContent = todo.completed
            ? 'Completed'
            : 'Not Complete';

        const cardActions = document.createElement('div');
        cardActions.classList.add('todo-actions');

        cardActions.append(
            completeBtn, editBtn, deleteBtn
        );

        todoDiv.append(
            title, description, dueDate, priority, status, cardActions
        );            

        container.appendChild(todoDiv);
    });
}

function createDeleteButton(project, todoIndex, projects) {
    const btn = document.createElement('button');

    btn.textContent = 'Delete';

    btn.addEventListener('click', () => {
        project.todos.splice(todoIndex, 1);

        saveProjects(projects);

        renderProjects(projects, project);
    });

    return btn;
}

const sidebar = document.getElementById('sidebar');

function renderProjectList(projects, activeProject) {
    sidebar.innerHTML = '';

    projects.forEach((project) => {
        const projectBtn = document.createElement('button');

        projectBtn.classList.add('project-btn');
        projectBtn.textContent = project.name;

        projectBtn.addEventListener('click', () => {
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