const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config();

const sslEnabled = String(process.env.DB_SSL || '').toLowerCase() === 'true';

function getSslConfig() {
  if (!sslEnabled) return undefined;

  if (process.env.DB_CA_CERT_BASE64) {
    return {
      ca: Buffer.from(process.env.DB_CA_CERT_BASE64, 'base64').toString('utf8'),
      rejectUnauthorized: true
    };
  }

  if (process.env.DB_CA_CERT) {
    return {
      ca: process.env.DB_CA_CERT.replace(/\\n/g, '\n'),
      rejectUnauthorized: true
    };
  }

  if (process.env.DB_CA_PATH) {
    return {
      ca: fs.readFileSync(process.env.DB_CA_PATH, 'utf8'),
      rejectUnauthorized: true
    };
  }

  return { rejectUnauthorized: true };
}

const ssl = getSslConfig();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true
});

module.exports = pool;
