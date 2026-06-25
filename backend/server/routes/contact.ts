import express from 'express';
import { adminAuth } from '../middleware/auth.ts';
import { fetchInquiries, createInquiryItem, deleteInquiryItem } from '../db.ts';
import { InquiryModel } from '../../../frontend/src/types.ts';

const router = express.Router();

// 1. Submit Inquiry (Public access)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, program, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Name, email, and message are required fields.' });
      return;
    }

    const newInquiry: InquiryModel = {
      id: 'inq-' + Date.now(),
      name,
      email,
      phone: phone || '',
      program: program || 'General Self-Defense',
      message,
      timestamp: new Date().toISOString()
    };

    await createInquiryItem(newInquiry);
    res.status(201).json({ success: true, inquiry: newInquiry });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log contact message.' });
  }
});

// 2. List Inquiries (Admin Only - Protected by JWT adminAuth middleware)
router.get('/', adminAuth, async (req, res) => {
  try {
    const inquiries = await fetchInquiries();
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get backend contact inquiries.' });
  }
});

// 3. Delete Inquiry (Admin Only - Protected by JWT adminAuth middleware)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const success = await deleteInquiryItem(req.params.id);
    res.json({ success });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear inquiry.' });
  }
});

export default router;
