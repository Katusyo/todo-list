import './style.css';

import Project from './modules/project';
import Todo from './modules/todo';
import renderProjects from './modules/dom';
import { loadProjects } from './modules/storage';

const projects = loadProjects();

if (projects.length === 0) {
    const defaultProject = new Project('default');

    defaultProject.addTodo(
        new Todo(
            'add project name',
            'Create a new project by entering a name and clicking the "Add Project" button.',
            'N/A',
            'N/A'
        )
    );

    projects.push(defaultProject);
}

let activeProject = projects[0];

renderProjects(projects, activeProject);