const bcrypt = require("bcryptjs");
const { pool, query } = require("../config/db");

async function seed() {
  const passwordHash = await bcrypt.hash("Admin@12345", 12);

  const adminResult = await query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, 'ADMIN')
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    ["Admin User", "admin@example.com", passwordHash]
  );

  await query(
    `INSERT INTO tasks (id, title, description, status, owner_id)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (id) DO NOTHING`,
    [
      "00000000-0000-0000-0000-000000000001",
      "Review API documentation",
      "Sample admin-owned task created by the seed script.",
      "IN_PROGRESS",
      adminResult.rows[0].id,
    ]
  );

  console.log("Seed complete. Admin login: admin@example.com / Admin@12345");
}

seed()
  .then(() => pool.end())
  .catch(async (error) => {
    console.error(error);
    await pool.end();
    process.exit(1);
  });
