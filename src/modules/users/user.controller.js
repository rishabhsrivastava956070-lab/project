const { query } = require("../../config/db");

async function listUsers(_req, res) {
  const result = await query(
    `SELECT id, name, email, role, created_at AS "createdAt"
     FROM users
     ORDER BY created_at DESC`
  );

  res.status(200).json({ success: true, data: { users: result.rows } });
}

module.exports = { listUsers };
