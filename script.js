
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const total = document.getElementById("total");
const completed = document.getElementById("completed");
const emptyMessage = document.getElementById("empty-message");

// Load saved tasks from this browser
let tasks = [];

try {
    tasks = JSON.parse(
        localStorage.getItem("studentTasks") || "[]"
    );

    if (!Array.isArray(tasks)) tasks = [];
} catch {
    tasks = [];
}

function saveTasks() {
    localStorage.setItem("studentTasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.replaceChildren();

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.className = task.done ? "done" : "";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;
        checkbox.setAttribute("aria-label", "Complete task");

        checkbox.addEventListener("change", () => {
            task.done = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const span = document.createElement("span");
        span.textContent = task.title;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            renderTasks();
        });

        li.append(checkbox, span, deleteButton);
        taskList.appendChild(li);
    });

    total.textContent = tasks.length;
    completed.textContent = tasks.filter(t => t.done).length;
    emptyMessage.hidden = tasks.length > 0;
}

form.addEventListener("submit", event => {
    event.preventDefault();

    const title = input.value.trim();
    if (!title) return;

    tasks.push({
        id: Date.now() + Math.random(),
        title,
        done: false
    });

    saveTasks();
    renderTasks();
    form.reset();
    input.focus();
});

renderTasks();
