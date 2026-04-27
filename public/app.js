const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const serverStatus = document.getElementById("serverStatus");
const serverTime = document.getElementById("serverTime");

async function checkHealth() {
  try {
    const response = await fetch("/api/health");
    const result = await response.json();

    serverStatus.textContent = result.status === "ok" ? "Online" : "Issue Found";
    serverTime.textContent = `Last checked: ${new Date(result.timestamp).toLocaleString()}`;
  } catch (error) {
    serverStatus.textContent = "Offline";
    serverTime.textContent = "Unable to connect with API";
  }
}

async function loadStats() {
  const response = await fetch("/api/stats");
  const result = await response.json();

  totalTasks.textContent = result.data.total;
  completedTasks.textContent = result.data.completed;
  pendingTasks.textContent = result.data.pending;
}

async function loadTasks() {
  const response = await fetch("/api/tasks");
  const result = await response.json();

  taskList.innerHTML = "";

  result.data.forEach((task) => {
    const item = document.createElement("div");
    item.className = "task-item";

    item.innerHTML = `
      <span class="status-dot ${task.status}"></span>

      <div>
        <div class="task-title">${escapeHtml(task.title)}</div>
        <div class="task-date">
          ${task.status.toUpperCase()} • ${new Date(task.createdAt).toLocaleString()}
        </div>
      </div>

      <span class="priority ${task.priority}">${task.priority}</span>

      <div class="task-actions">
        <button class="done-btn" onclick="toggleTask(${task.id})">
          ${task.status === "completed" ? "Undo" : "Done"}
        </button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">
          Delete
        </button>
      </div>
    `;

    taskList.appendChild(item);
  });
}

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = taskInput.value.trim();
  const priority = priorityInput.value;

  if (!title) return;

  await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, priority })
  });

  taskInput.value = "";
  priorityInput.value = "medium";

  await refreshDashboard();
});

async function toggleTask(id) {
  await fetch(`/api/tasks/${id}/toggle`, {
    method: "PATCH"
  });

  await refreshDashboard();
}

async function deleteTask(id) {
  await fetch(`/api/tasks/${id}`, {
    method: "DELETE"
  });

  await refreshDashboard();
}

async function refreshDashboard() {
  await checkHealth();
  await loadStats();
  await loadTasks();
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

refreshDashboard();

setInterval(checkHealth, 10000);