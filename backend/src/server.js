import 'dotenv/config';
import { listen } from './app.js';
import {query} from './config/db.js';

const PORT = process.env.PORT || 3000;

listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

// Optional connection test
query('SELECT 1')
  .then(() => console.log('Database connected'))
  .catch(console.error);
