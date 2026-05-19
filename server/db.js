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

  const rawCert = (process.env.DB_CA_CERT || '').replace(/\\n/g, '\n');
  if (rawCert.includes('-----BEGIN CERTIFICATE-----') && rawCert.includes('-----END CERTIFICATE-----')) {
    return {
      ca: rawCert,
      rejectUnauthorized: true
    };
  }

  if (process.env.DB_CA_PATH) {
    return {
      ca: fs.readFileSync(process.env.DB_CA_PATH, 'utf8'),
      rejectUnauthorized: true
    };
  }

  // In development, allow SSL without strict cert verification
  // (dotenv cannot parse multi-line certs; Aiven connection is still encrypted)
  if (process.env.NODE_ENV !== 'production') {
    return { rejectUnauthorized: false };
  }

  return { rejectUnauthorized: true };
}

const ssl = getSslConfig();

const poolConfig = {
  ssl,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
  // Keep connections alive and discard stale ones (Aiven drops idle connections)
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  idleTimeout: 60000
};

if (process.env.DATABASE_URL) {
  poolConfig.uri = process.env.DATABASE_URL;
} else {
  poolConfig.host = process.env.DB_HOST;
  poolConfig.port = Number(process.env.DB_PORT || 3306);
  poolConfig.user = process.env.DB_USER;
  poolConfig.password = process.env.DB_PASSWORD;
  poolConfig.database = process.env.DB_NAME;
}

const pool = mysql.createPool(poolConfig);

module.exports = pool;
