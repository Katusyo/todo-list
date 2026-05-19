const content = document.getElementById('content');

function renderProjects(projects) {
    content.innerHTML = '';

    projects.forEach((project) => {
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('project');

        const projectTitle = document.createElement('h2');
        projectTitle.textContent = project.name;

        projectDiv.appendChild(projectTitle);

        renderTodos(project, projectDiv, projects);

        content.appendChild(projectDiv);
    });
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

            renderProjects(projects);
        });

        const completeBtn = document.createElement('button');
        completeBtn.textContent = 'Complete';
        completeBtn.addEventListener('click', () => {
            todo.completed = !todo.completed;

            renderProjects(projects);
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

        renderProjects(projects);
    });

    return btn;
}

export default renderProjects;