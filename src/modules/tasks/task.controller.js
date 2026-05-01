const taskService = require("./task.service");

async function listTasks(req, res) {
  const data = await taskService.listTasks(req.user, req.query);
  res.status(200).json({ success: true, data });
}

async function getTask(req, res) {
  const task = await taskService.getTask(req.user, req.params.id);
  res.status(200).json({ success: true, data: { task } });
}

async function createTask(req, res) {
  const task = await taskService.createTask(req.user, req.body);
  res.status(201).json({ success: true, message: "Task created", data: { task } });
}

async function updateTask(req, res) {
  const task = await taskService.updateTask(req.user, req.params.id, req.body);
  res.status(200).json({ success: true, message: "Task updated", data: { task } });
}

async function deleteTask(req, res) {
  await taskService.deleteTask(req.user, req.params.id);
  res.status(200).json({ success: true, message: "Task deleted" });
}

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask };
