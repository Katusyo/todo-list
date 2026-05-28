import Project from './project';
import Todo from './todo';

let currentActiveProject = null;

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

    renderProjects(currentProjects, newProject);

    modal.classList.add('hidden');

    projectForm.reset();
});

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const todoTitle = document.getElementById('todo-title').value;
    const todoDescription = document.getElementById('todo-description').value;
    const todoDate = document.getElementById('todo-date').value;
    const todoPriority = document.getElementById('todo-priority').value;
    
    const newTodo = new Todo(
        todoTitle,
        todoDescription,
        todoDate,
        todoPriority
);

    currentActiveProject.addTodo(newTodo);

    renderProjects(currentProjects, currentActiveProject);

    taskModal.classList.add('hidden');

    taskForm.reset();
});

let currentProjects = [];

function renderProjects(projects, activeProject) {
    if (!activeProject) return;

    content.innerHTML = '';
    currentActiveProject = activeProject;

    renderProjectList(projects, activeProject);

    const addTaskBtn = document.createElement('button');

    addTaskBtn.textContent = 'Add Task';

    addTaskBtn.addEventListener('click', () => {
    taskModal.classList.remove('hidden');
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

        if (projects.length === 0) {
            content.innerHTML = '';
            renderProjectList(projects, null);

            content.innerHTML = '';

            return;
        }

        renderProjects(projects, projects[0]);
    });

    projectDiv.append(title, deleteProjectBtn, addTaskBtn);

    renderTodos(activeProject, projectDiv, projects);

    content.appendChild(projectDiv);
}

function renderTodos(project, container, projects) {
    project.todos.forEach((todo, todoIndex) => {
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo-card');

        const title = document.createElement('h3');
        title.textContent = todo.title;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            project.todos.splice(todoIndex, 1);

            renderProjects(currentProjects, project);
        });

        const completeBtn = document.createElement('button');
        completeBtn.textContent = 'Complete';
        completeBtn.addEventListener('click', () => {
            todo.completed = !todo.completed;

            renderProjects(projects, project);
        });


        const description = document.createElement('p');
        description.textContent = todo.description;

        const dueDate = document.createElement('p');
        dueDate.textContent = `Due: ${todo.dueDate}`;

        const priority = document.createElement('p');
        priority.textContent = `Priority: ${todo.priority}`;
        
        const status =document.createElement('p');
        status.textContent = todo.completed
            ? 'Completed'
            : 'Not Complete';
        
        todoDiv.append(title, completeBtn, deleteBtn, description, dueDate, priority, status);

        container.appendChild(todoDiv);
    });
}

function createDeleteButton(project, todoIndex, projects) {
    const btn = document.createElement('button');

    btn.textContent = 'Delete';

    btn.addEventListener('click', () => {
        project.todos.splice(todoIndex, 1);

        renderProjects(projects, project);
    });

    return btn;
}

const sidebar = document.getElementById('sidebar');

function renderProjectList(projects, activeProject) {
    sidebar.innerHTML = '';

    projects.forEach((project) => {
        const projectBtn = document.createElement('button');

        projectBtn.textContent = project.name;

        projectBtn.addEventListener('click', () => {
            renderProjects(projects, project);
        });

        sidebar.appendChild(projectBtn);
    });

        const addProjectBtn = document.createElement('button');

        addProjectBtn.textContent = 'Add Project';

        addProjectBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');
            projectForm.reset();
        });

            sidebar.appendChild(addProjectBtn);
    }
export default renderProjects;

function createStarterTodo() {
    return new Todo(
        'New Todo',
        'Add a descrition',
        'No due date',
        'Low'
    );
}