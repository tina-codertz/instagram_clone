
import 'dotenv/config';

import { listen } from './app.js';
import prisma from './config/db.js'; 

const PORT = process.env.PORT || 3000;

listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
// Optional test
prisma.$connect().then(() => console.log('✅ Connected!')).catch(console.error);