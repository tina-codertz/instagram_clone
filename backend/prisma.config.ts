import 'dotenv/config'; // Loads your .env file
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma', // Adjust if your schema is in a different path
  datasource: {
    url: env('DATABASE_URL'),
  },
  
});