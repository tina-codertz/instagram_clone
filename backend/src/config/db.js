// src/config/db.js
import 'dotenv/config';  // Load .env here too as backup
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL?.trim();

if (!connectionString) {
  throw new Error(' DATABASE_URL is missing or empty! Check your .env file and ensure dotenv is loaded first.');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  // Optional: enable logging to see what's happening
  // log: ['query', 'info', 'warn', 'error'],
});

// Graceful shutdown
const shutdown = async () => {
  await prisma.$disconnect();
  await pool.end();
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export default prisma;