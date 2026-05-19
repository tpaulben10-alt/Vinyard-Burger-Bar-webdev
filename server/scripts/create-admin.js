const bcrypt = require('bcryptjs');
const pool = require('../db');

async function createAdmin() {
  const name = 'Admin';
  const email = 'admin@vinyard.com';
  const password = 'admin123';
  const role = 'admin';

  const hash = await bcrypt.hash(password, 10);

  await pool.execute(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE role = ?',
    [name, email, hash, role, role]
  );

  console.log('Admin account created:');
  console.log('  Email   :', email);
  console.log('  Password:', password);
  console.log('  Role    :', role);
}

createAdmin()
  .catch((err) => {
    console.error('Error:', err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
