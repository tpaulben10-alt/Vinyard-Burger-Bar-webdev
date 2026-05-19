const pool = require('../db');

async function listUsers() {
  const [rows] = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY role DESC');
  if (rows.length === 0) {
    console.log('No users found in the database.');
  } else {
    console.table(rows);
  }
}

listUsers()
  .catch((err) => {
    console.error('Error:', err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
