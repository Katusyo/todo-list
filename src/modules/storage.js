import Project from './project';
import Todo from './todo';

export function saveProjects(projects) {
    localStorage.setItem(
        'projects',
        JSON.stringify(projects)
    );
}

export function loadProjects() {
    const data = localStorage.getItem('projects');

    if (!data) return [];

    const parsed = JSON.parse(data);

    return parsed.map(projectData => {
        const project = new Project(projectData.name);

        project.todos = (projectData.todos || []).map(todoData => {
            const todo = new Todo(
                todoData.title,
                todoData.description,
                todoData.dueDate,
                todoData.priority
            );

            todo.completed = todoData.completed;

            return todo;
        });

        return project;
    });
}