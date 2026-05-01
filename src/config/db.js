const { Pool } = require("pg");
const { env } = require("./env");

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
});

async function query(text, params) {
  const result = await pool.query(text, params);
  return result;
}

module.exports = { pool, query };
