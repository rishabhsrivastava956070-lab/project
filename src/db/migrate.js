const fs = require("fs");
const path = require("path");
const { pool } = require("../config/db");

async function migrate() {
  const schema = fs.readFileSync(path.join(__dirname, "../../database/schema.sql"), "utf8");
  await pool.query(schema);
  console.log("Database schema is ready.");
}

migrate()
  .then(() => pool.end())
  .catch(async (error) => {
    console.error(error);
    await pool.end();
    process.exit(1);
  });
