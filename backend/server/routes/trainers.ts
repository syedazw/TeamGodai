import express from 'express';
import { adminAuth } from '../middleware/auth.ts';
import { fetchTrainers, createTrainerItem, updateTrainerItem, deleteTrainerItem } from '../db.ts';
import { TrainerModel } from '../../../frontend/src/types.ts';

const router = express.Router();

// 1. List All Trainers
router.get('/', async (req, res) => {
  try {
    const trainers = await fetchTrainers();
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve trainer roster.' });
  }
});

// 2. Register Trainer (Admin Only - Protected by JWT adminAuth middleware)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, specialty, experience, bio, imageUrl } = req.body;

    if (!name || !bio) {
      res.status(400).json({ error: 'Missing mandatory trainer parameters.' });
      return;
    }

    const newTrainer: TrainerModel = {
      id: 'trainer-' + Date.now(),
      name,
      specialty,
      experience,
      bio,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80'
    };

    await createTrainerItem(newTrainer);
    res.status(201).json(newTrainer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to register trainer.' });
  }
});

// 3. Update Trainer (Admin Only - Protected by JWT adminAuth middleware)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const trainers = await fetchTrainers();
    const current = trainers.find(t => t.id === req.params.id);
    if (!current) {
      res.status(404).json({ error: 'Trainer not found.' });
      return;
    }

    const { name, specialty, experience, bio, imageUrl } = req.body;

    const updatedTrainer: TrainerModel = {
      ...current,
      name: name ?? current.name,
      specialty: specialty ?? current.specialty,
      experience: experience ?? current.experience,
      bio: bio ?? current.bio,
      imageUrl: imageUrl ?? current.imageUrl
    };

    const success = await updateTrainerItem(updatedTrainer);
    if (success) {
      res.json(updatedTrainer);
    } else {
      res.status(500).json({ error: 'Failed to write updates.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update trainer resource.' });
  }
});

// 4. Delete Trainer (Admin Only - Protected by JWT adminAuth middleware)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const success = await deleteTrainerItem(req.params.id);
    if (!success) {
      res.status(404).json({ error: 'Trainer target not found.' });
      return;
    }
    res.json({ success: true, message: 'Trainer rostered off successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete trainer.' });
  }
});

export default router;
