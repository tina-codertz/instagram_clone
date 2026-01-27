// src/app.js  (or wherever your app file is)
import express, { json } from 'express';
import routes from './routes.js';
import 'dotenv/config';  // ESM way to load .env

const app = express();

app.use(json());
app.use('/api', routes);

// Export a named listen function
export const listen = (port, callback) => {
  app.listen(port, callback);
};

// Also keep default export if other files need the app instance
export default app; 