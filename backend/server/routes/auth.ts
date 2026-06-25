import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { useMySQL, mysqlStatusMessage } from '../db.ts';
import { JWT_SECRET } from '../middleware/auth.ts';

const router = express.Router();

// Get database status check
router.get('/database/status', (req, res) => {
  res.json({
    connected: useMySQL,
    engine: useMySQL ? 'MySQL Database Server (Active)' : 'Local File JSON Fallback (Active)',
    statusMessage: mysqlStatusMessage,
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    database: process.env.MYSQL_DATABASE || 'team_godai_pakistan',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
    port: process.env.MYSQL_PORT || '3306',
  });
});

// Admin Authentication Login (with secure bcrypt verification!)
router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  // Accept both basic password check or with 'admin' username
  const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
  if (username && username.trim().toLowerCase() !== expectedUsername.toLowerCase()) {
    res.status(401).json({ error: 'Invalid administrative credentials.' });
    return;
  }

  const targetPassword = process.env.ADMIN_PASSWORD || 'admin123';
  // Hashing the configured password securely using bcrypt on compile/load
  const targetPasswordHash = process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync(targetPassword, 10);

  try {
    const isPasswordCorrect = bcrypt.compareSync(password || '', targetPasswordHash);
    
    if (isPasswordCorrect) {
      // Issue a cryptographically-secure JWT token
      const token = jwt.sign(
        { role: 'admin', username: expectedUsername },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      res.json({ success: true, token });
    } else {
      res.status(401).json({ error: 'Invalid administrative password.' });
    }
  } catch (error) {
    console.error('Bcrypt compare error:', error);
    res.status(500).json({ error: 'Internal cryptographical error.' });
  }
});

// Verifies token status
router.get('/admin/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.json({ valid: false });
    return;
  }
  
  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, JWT_SECRET);
    res.json({ valid: true });
  } catch (error) {
    res.json({ valid: false });
  }
});

export default router;
