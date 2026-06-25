import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'mma_training_academy_ultra_secure_jwt_secret_key_2026';

export interface AdminPayload {
  role: string;
}

// Extend Request interface
export interface AuthRequest extends Request {
  user?: AdminPayload;
}

export const adminAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
     res.status(401).json({ error: 'Access denied. Missing authorization credentials.' });
     return;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
     res.status(401).json({ error: 'Auth token format must be Bearer <token>.' });
     return;
  }

  const token = parts[1];

  try {
    const verified = jwt.verify(token, JWT_SECRET) as AdminPayload;
    req.user = verified;
    next();
  } catch (error) {
     res.status(401).json({ error: 'Invalid or expired administrative authorization token.' });
  }
};
