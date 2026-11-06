# Todo-list

A project-based todo app built with vanilla JavaScript. Tasks live inside projects, are saved in the browser automatically, and can be viewed by project, by what's due today, or by what's overdue.

**Live demo:**<https://katusyo.github.io/todo-list/>

**Screenshot**
<img width="1920" height="826" alt="Todo-List" src="https://github.com/user-attachments/assets/4e35da60-7317-489e-8cae-33a9d8485f99" />

## Built with
- JavaScript (ES modules and classes)
- webpack 5 (with Babel, HtmlWebpackPlugin and webpack-dev-server)
- date-fns for date handling and formatting
- HTML and CSS (modal dialogs, responsive sidebar layout)

## Features
- Create multiple projects, each with its own task list
- Add, edit, delete and mark tasks complete through modal forms
- Each task has a title, description, due date and priority (Low / Medium / High)
- Sort tasks by due date, priority or title
- "Today" and "Overdue" views that gather tasks across all projects
- Automatic persistence with localStorage -- projects and tasks are restored as class instances on reload, so nothing is lost when the page closes
- A starter project with a sample task is created on first run

## What I learned
- Splitting an app into single-purpose modules: Todo and Project classes for the data model, a storage module for localStorage, and a dom module for all rendering
- Serialising class instances to JSON and rehydrating them back into real objects on load
- Managing shared UI state (active project, current sort, current view, the task being edited) across re-renders
- Event handling for dynamically created elements -- every button is wired up at render time

## Run it locally
- git clone https://github.com/Katusyo/todo-list.git
- cd todo-list
- npm install
- npm start    # webpack dev server
- npm run build  # production build into dist/



## About
**Built as part of The Odin Project's JavaScript course (Todo List project).**
