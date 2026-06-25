import express from 'express';
import { adminAuth } from '../middleware/auth.ts';
import { fetchEvents, createEventItem, updateEventItem, deleteEventItem, isPastDate } from '../db.ts';
import { EventModel } from '../../../frontend/src/types.ts';

const router = express.Router();

// 1. List All Events
router.get('/', async (req, res) => {
  try {
    const events = await fetchEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve event list.' });
  }
});

// 2. Fetch Single Event Detail
router.get('/:id', async (req, res) => {
  try {
    const events = await fetchEvents();
    const event = events.find(e => e.id === req.params.id);
    if (!event) {
      res.status(404).json({ error: 'Requested event not found.' });
      return;
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Error pulling event details.' });
  }
});

// 3. Create Event (Admin Only - Protected by JWT adminAuth middleware)
router.post('/', adminAuth, async (req, res) => {
  try {
    console.log("Body:", req.body)
    const { title, date, time, location, status,  content, posterUrl, videoUrl, galleryUrls, autoScrollEnabled } = req.body;
    
    if (!title || !date || !status  || !content) {
      res.status(400).json({ error: 'Missing compulsory event parameters.' });
      return;
    }

    // Verify status vs past date
    if (isPastDate(date) && status === 'Upcoming') {
      res.status(400).json({ error: 'Past events cannot be marked as Upcoming. Please select Completed status.' });
      return;
    }

    const finalStatus = isPastDate(date) ? 'Completed' : (status || 'Upcoming');


    const newEvent: EventModel = {
      id: 'event-' + Date.now(),
      title,
      date,
      time: time || 'TBD',
      location: location || 'Academy Arena',
      status: finalStatus,
      content,
      posterUrl: posterUrl || 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&h=500&q=80',
      videoUrl: videoUrl || '',
      galleryUrls: galleryUrls || [],
      autoScrollEnabled: autoScrollEnabled ?? false
    };

    await createEventItem(newEvent);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create new event resource.' });
  }
});

// 4. Update Event (Admin Only - Protected by JWT adminAuth middleware)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const events = await fetchEvents();
    const current = events.find(e => e.id === req.params.id);
    if (!current) {
      res.status(404).json({ error: 'Event target not found for updating.' });
      return;
    }

    const { title, date, time, location, status, content, posterUrl, videoUrl, galleryUrls, autoScrollEnabled } = req.body;

    const targetDate = date ?? current.date;
    const targetStatus = status ?? current.status;

    // Verify status vs past date
    if (isPastDate(targetDate) && targetStatus === 'Upcoming') {
      res.status(400).json({ error: 'Past events cannot be marked as Upcoming. Please select Completed status.' });
      return;
    }

    const finalStatus = isPastDate(targetDate) ? 'Completed' : targetStatus;


    const updatedEvent: EventModel = {
      ...current,
      title: title ?? current.title,
      date: date ?? current.date,
      time: time ?? current.time,
      location: location ?? current.location,
      status: finalStatus,
      content: content ?? current.content,
      posterUrl: posterUrl ?? current.posterUrl,
      videoUrl: videoUrl ?? current.videoUrl,
      galleryUrls: galleryUrls ?? current.galleryUrls,
      autoScrollEnabled: autoScrollEnabled ?? current.autoScrollEnabled
    };

    const updated = await updateEventItem(updatedEvent);
    if (updated) {
      res.json(updatedEvent);
    } else {
      res.status(500).json({ error: 'Failed to apply update.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event resource.' });
  }
});

// 5. Delete Event (Admin Only - Protected by JWT adminAuth middleware)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const success = await deleteEventItem(req.params.id);
    if (!success) {
      res.status(404).json({ error: 'Event target not found.' });
      return;
    }
    res.json({ success: true, message: 'Event deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event.' });
  }
});

export default router;
