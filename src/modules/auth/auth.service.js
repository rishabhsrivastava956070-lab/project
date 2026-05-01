const bcrypt = require("bcryptjs");
const { query } = require("../../config/db");
const { ApiError } = require("../../utils/api-error");
const { signAccessToken } = require("../../utils/jwt");

async function register({ name, email, password }) {
  const existing = await query("SELECT id FROM users WHERE email = $1", [email]);
  if (existing.rowCount > 0) {
    throw new ApiError(409, "Email is already registered");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const result = await query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, role, created_at AS "createdAt"`,
    [name, email, passwordHash]
  );
  const user = result.rows[0];

  return { user, token: signAccessToken(user) };
}

async function login({ email, password }) {
  const result = await query(
    `SELECT id, name, email, password_hash AS "passwordHash", role, created_at AS "createdAt"
     FROM users
     WHERE email = $1`,
    [email]
  );
  const user = result.rows[0];
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const publicUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };

  return { user: publicUser, token: signAccessToken(user) };
}

module.exports = { register, login };
