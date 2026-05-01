const { query } = require("../../config/db");
const { ApiError } = require("../../utils/api-error");

function buildTaskData(input) {
  return {
    title: input.title,
    description: input.description || null,
    status: input.status,
    dueDate: input.dueDate ? new Date(input.dueDate) : null,
  };
}

async function listTasks(user, { status, page, limit }) {
  const conditions = [];
  const params = [];

  if (user.role !== "ADMIN") {
    params.push(user.id);
    conditions.push(`t.owner_id = $${params.length}`);
  }

  if (status) {
    params.push(status);
    conditions.push(`t.status = $${params.length}`);
  }

  const whereSql = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const countResult = await query(`SELECT COUNT(*)::int AS total FROM tasks t ${whereSql}`, params);

  params.push(limit, (page - 1) * limit);
  const itemsResult = await query(
    `SELECT
       t.id, t.title, t.description, t.status,
       t.due_date AS "dueDate",
       t.owner_id AS "ownerId",
       t.created_at AS "createdAt",
       t.updated_at AS "updatedAt",
       json_build_object('id', u.id, 'name', u.name, 'email', u.email) AS owner
     FROM tasks t
     JOIN users u ON u.id = t.owner_id
     ${whereSql}
     ORDER BY t.created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  const items = itemsResult.rows;
  const total = countResult.rows[0].total;

  return {
    items,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  };
}

async function getTask(user, id) {
  const result = await query(
    `SELECT
       t.id, t.title, t.description, t.status,
       t.due_date AS "dueDate",
       t.owner_id AS "ownerId",
       t.created_at AS "createdAt",
       t.updated_at AS "updatedAt",
       json_build_object('id', u.id, 'name', u.name, 'email', u.email) AS owner
     FROM tasks t
     JOIN users u ON u.id = t.owner_id
     WHERE t.id = $1`,
    [id]
  );
  const task = result.rows[0];

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (user.role !== "ADMIN" && task.ownerId !== user.id) {
    throw new ApiError(403, "You can only access your own tasks");
  }

  return task;
}

async function createTask(user, input) {
  const data = buildTaskData(input);
  const result = await query(
    `INSERT INTO tasks (title, description, status, due_date, owner_id)
     VALUES ($1, $2, COALESCE($3, 'TODO')::task_status, $4, $5)
     RETURNING id, title, description, status, due_date AS "dueDate",
       owner_id AS "ownerId", created_at AS "createdAt", updated_at AS "updatedAt"`,
    [data.title, data.description, data.status || null, data.dueDate, user.id]
  );
  return result.rows[0];
}

async function updateTask(user, id, input) {
  await getTask(user, id);
  const fields = [];
  const params = [];

  for (const [column, value] of [
    ["title", input.title],
    ["description", input.description || null],
    ["status", input.status],
    ["due_date", input.dueDate ? new Date(input.dueDate) : null],
  ]) {
    if (Object.prototype.hasOwnProperty.call(input, column === "due_date" ? "dueDate" : column)) {
      params.push(value);
      fields.push(`${column} = $${params.length}${column === "status" ? "::task_status" : ""}`);
    }
  }

  params.push(id);
  const result = await query(
    `UPDATE tasks
     SET ${fields.join(", ")}
     WHERE id = $${params.length}
     RETURNING id, title, description, status, due_date AS "dueDate",
       owner_id AS "ownerId", created_at AS "createdAt", updated_at AS "updatedAt"`,
    params
  );
  return result.rows[0];
}

async function deleteTask(user, id) {
  await getTask(user, id);
  await query("DELETE FROM tasks WHERE id = $1", [id]);
}

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask };
