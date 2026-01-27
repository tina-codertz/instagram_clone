import 'dotenv/config';
import pkg from 'pg';

const { Pool } = pkg;

const connectionString = "postgresql://postgres:password@localhost:5432/instagram_db?schema=public" //process.env.DATABASE_URL?.trim();

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is missing or empty! Check your .env file and ensure dotenv is loaded.'
  );
}

export const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
});

/**
 * Helper function for queries
 * @param {string} text - SQL query
 * @param {Array} params - query parameters
 */
export const query = (text, params) => {
  return pool.query(text, params);
};

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down database pool...');
  await pool.end();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

1
