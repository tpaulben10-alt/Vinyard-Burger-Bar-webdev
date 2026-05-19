const fs = require('fs/promises');
const path = require('path');
const pool = require('../db');

async function seed() {
  const sql = await fs.readFile(path.join(__dirname, '..', 'seed.sql'), 'utf8');
  const statements = sql
    .replace(/^\s*--.*$/gm, '')
    .split(/;\s*(?:\r?\n|$)/)
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await pool.query(statement);
  }

  console.log('Database seed completed.');
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
