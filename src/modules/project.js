export default class Project {
    constructor(name) {
        this.name = name;
        this.todos = [];
    }

    addTodo(todo) {
        this.todos.push(todo);
    }
}

[
    {
        name: 'default',
        todos: [
            {
                title: 'Enter project name',
                description: 'Create a new project by entering a name and clicking the "Add Project" button.',
                dueDate: 'N/A',
                priority: 'N/A',
                completed: false,
            },
        ],
    },
];