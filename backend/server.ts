/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';

// Load ENV
dotenv.config();

// Database initialization & uploads paths
import { initializeDatabase, UPLOADS_DIR } from './server/db.ts';

// Router Imports - Completely separated Headless API Server
import authRouter from './server/routes/auth.ts';
import eventsRouter from './server/routes/events.ts';
import trainersRouter from './server/routes/trainers.ts';
import contactRouter from './server/routes/contact.ts';
import uploadRouter from './server/routes/upload.ts';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable JSON and URL-encoded line parsing
app.use(express.json({ limit: '110mb' }));
app.use(express.urlencoded({ limit: '110mb', extended: true }));

// Enable CORS for separated frontend/backend deployments
app.use(cors());

// Serve public uploads statically from /uploads URL directly
app.use('/uploads', express.static(UPLOADS_DIR));

// Initialize Database connection / fallbacks and verify schemas
async function startServer() {
  await initializeDatabase();

  // Register Separated API Routes
  app.use('/api', authRouter);
  app.use('/api/events', eventsRouter);
  app.use('/api/trainers', trainersRouter);
  app.use('/api/contact', contactRouter);
  app.use('/api/upload', uploadRouter);

  // Health Check Endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      success: true,
      status: 'OK',
    });
  });

  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'Martial Arts API Server Running'
    });
  });

  app.listen(Number(PORT), () => {
    console.log(`Server running on port ${PORT}`);
  });

  app.listen
}

// Call the database initialization function
startServer();



// Static endpoint to read schedules (read-only helper for calendar)
// import { WEEKLY_SCHEDULE } from './server/schedule.ts';
// app.get('/api/schedule', (req, res) => {
//   res.json(WEEKLY_SCHEDULE);
// });


export default app;
