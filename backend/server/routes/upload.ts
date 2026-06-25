import express from 'express';
import multer from 'multer';
import path from 'path';
import { adminAuth } from '../middleware/auth.ts';
import { UPLOADS_DIR } from '../db.ts';

const router = express.Router();

// Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    let ext = path.extname(file.originalname);
    if (!ext) {
      const mimeMap: Record <string, string >= {
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
        'image/webp': '.webp',
        'video/mp4': '.mp4',
        'video/webm': '.webm',
        'video/quicktime': '.mov',
        'video/ogg': '.ogv',
      };
      ext = mimeMap[file.mimetype] || '';
    }
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit for videos and posters
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only MP4 videos and JPEG/PNG images are allowed.'));
    }
}
});

const uploadSingle = upload.single('file');

// File Upload Endpoint (Admin Only - Protected by JWT adminAuth middleware)
router.post('/', adminAuth,  (req, res) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    } 
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file included in multipart write.' });
      return;
    }
    const relativeUrl = `/uploads/${req.file.filename}`;
    res.json({ url: relativeUrl });
  } catch (error) {
    res.status(500).json({ error: 'File upload processing failed.' });
  }
})
});

export default router;
