const content = document.getElementById('content');

function renderProjects(projects) {
    content.innerHTML = '';

    projects.forEach((project) => {
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('project');

        const projectTitle = document.createElement('h2');
        projectTitle.textContent = project.name;

        projectDiv.appendChild(projectTitle);

        renderTodos(project, projectDiv);

        content.appendChild(projectDiv);
    });
}

function renderTodos(project, container) {
    project.todos.forEach((todo) => {
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo-card');

        const title = document.createElement('h3');
        title.textContent = todo.title;

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
        
        todoDiv.append(title, description, dueDate, priority, status);

        container.appendChild(todoDiv);
    });
}

export default renderProjects;