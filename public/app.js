const apiBase = "/api/v1";
let token = localStorage.getItem("token") || "";
let currentUser = JSON.parse(localStorage.getItem("user") || "null");

const messageEl = document.querySelector("#message");
const userText = document.querySelector("#userText");
const tasksEl = document.querySelector("#tasks");
const taskForm = document.querySelector("#taskForm");

function showMessage(text, type = "success") {
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
}

function setSession(data) {
  token = data.token;
  currentUser = data.user;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(currentUser));
  renderUser();
}

function clearSession() {
  token = "";
  currentUser = null;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  renderUser();
  renderTasks([]);
}

function renderUser() {
  userText.textContent = currentUser
    ? `${currentUser.name} (${currentUser.role})`
    : "Not logged in";
}

async function request(path, options = {}) {
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.message || "Request failed");
  }
  return payload;
}

function taskMarkup(task) {
  const description = task.description || "No description";
  return `
    <article class="task">
      <div>
        <h3>${escapeHtml(task.title)}</h3>
        <p>${escapeHtml(description)}</p>
        <span class="badge">${task.status}</span>
      </div>
      <div class="actions">
        <button class="secondary" type="button" data-edit="${task.id}">Edit</button>
        <button type="button" data-delete="${task.id}">Delete</button>
      </div>
    </article>
  `;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return map[char];
  });
}

function renderTasks(tasks) {
  tasksEl.innerHTML = tasks.length ? tasks.map(taskMarkup).join("") : "<p>No tasks yet.</p>";
}

async function loadTasks() {
  if (!token) {
    showMessage("Login first to load protected tasks.", "error");
    return;
  }
  const payload = await request("/tasks");
  renderTasks(payload.data.items);
  showMessage("Tasks loaded.");
}

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");
    document.querySelector("#loginForm").classList.toggle("hidden", button.dataset.tab !== "login");
    document.querySelector("#registerForm").classList.toggle("hidden", button.dataset.tab !== "register");
  });
});

document.querySelector("#loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(event.target);
  try {
    const payload = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(form)),
    });
    setSession(payload.data);
    showMessage(payload.message);
    await loadTasks();
  } catch (error) {
    showMessage(error.message, "error");
  }
});

document.querySelector("#registerForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(event.target);
  try {
    const payload = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(form)),
    });
    setSession(payload.data);
    event.target.reset();
    showMessage(payload.message);
    await loadTasks();
  } catch (error) {
    showMessage(error.message, "error");
  }
});

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(taskForm);
  const data = Object.fromEntries(form);
  const id = data.id;
  delete data.id;
  if (!data.description) delete data.description;

  try {
    const payload = await request(id ? `/tasks/${id}` : "/tasks", {
      method: id ? "PATCH" : "POST",
      body: JSON.stringify(data),
    });
    taskForm.reset();
    taskForm.elements.id.value = "";
    showMessage(payload.message);
    await loadTasks();
  } catch (error) {
    showMessage(error.message, "error");
  }
});

tasksEl.addEventListener("click", async (event) => {
  const editId = event.target.dataset.edit;
  const deleteId = event.target.dataset.delete;

  try {
    if (editId) {
      const payload = await request(`/tasks/${editId}`);
      const task = payload.data.task;
      taskForm.elements.id.value = task.id;
      taskForm.elements.title.value = task.title;
      taskForm.elements.description.value = task.description || "";
      taskForm.elements.status.value = task.status;
      showMessage("Task loaded for editing.");
    }

    if (deleteId) {
      await request(`/tasks/${deleteId}`, { method: "DELETE" });
      showMessage("Task deleted.");
      await loadTasks();
    }
  } catch (error) {
    showMessage(error.message, "error");
  }
});

document.querySelector("#refreshBtn").addEventListener("click", () => {
  loadTasks().catch((error) => showMessage(error.message, "error"));
});

document.querySelector("#logoutBtn").addEventListener("click", () => {
  clearSession();
  showMessage("Logged out.");
});

renderUser();
if (token) {
  loadTasks().catch((error) => showMessage(error.message, "error"));
}
