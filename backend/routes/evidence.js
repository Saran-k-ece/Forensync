import express from 'express';
import Evidence from '../models/Evidence.js';
import { simpleAuth } from '../middleware/auth.js';

const router = express.Router();

// Receive POST requests from ESP8266 hardware
router.post('/hardware', async (req, res) => {
  try {
    const { tagId, location, status, description } = req.body;

    if (!tagId || !location) {
      return res.status(400).json({ message: 'Tag ID and location are required' });
    }

    const evidenceId = `EV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const evidence = new Evidence({
      evidenceId,
      tagId,
      location,
      status: status || 'Collected',
      description: description || '',
      timestamp: new Date(),
      isNew: true
    });

    await evidence.save();

    res.status(201).json({
      message: 'Evidence data received successfully',
      data: evidence
    });
  } catch (error) {
    console.error('Error saving evidence:', error);
    res.status(500).json({ message: 'Error saving evidence data', error: error.message });
  }
});

// Get all evidence (for dashboard)
router.get('/', simpleAuth, async (req, res) => {
  try {
    const evidence = await Evidence.find().sort({ timestamp: -1 });
    res.status(200).json(evidence);
  } catch (error) {
    console.error('Error fetching evidence:', error);
    res.status(500).json({ message: 'Error fetching evidence', error: error.message });
  }
});

// Get single evidence by ID
router.get('/:id', simpleAuth, async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id);
    if (!evidence) {
      return res.status(404).json({ message: 'Evidence not found' });
    }
    res.status(200).json(evidence);
  } catch (error) {
    console.error('Error fetching evidence:', error);
    res.status(500).json({ message: 'Error fetching evidence', error: error.message });
  }
});

// Update evidence
router.put('/:id', simpleAuth, async (req, res) => {
  try {
    const { status, location, description } = req.body;
    const updateData = {};

    if (status) updateData.status = status;
    if (location) updateData.location = location;
    if (description !== undefined) updateData.description = description;
    updateData.isNew = false;

    const evidence = await Evidence.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!evidence) {
      return res.status(404).json({ message: 'Evidence not found' });
    }

    res.status(200).json(evidence);
  } catch (error) {
    console.error('Error updating evidence:', error);
    res.status(500).json({ message: 'Error updating evidence', error: error.message });
  }
});

// Delete evidence
router.delete('/:id', simpleAuth, async (req, res) => {
  try {
    const evidence = await Evidence.findByIdAndDelete(req.params.id);
    if (!evidence) {
      return res.status(404).json({ message: 'Evidence not found' });
    }
    res.status(200).json({ message: 'Evidence deleted successfully' });
  } catch (error) {
    console.error('Error deleting evidence:', error);
    res.status(500).json({ message: 'Error deleting evidence', error: error.message });
  }
});

// Mark evidence as viewed (remove new flag)
router.patch('/:id/mark-viewed', simpleAuth, async (req, res) => {
  try {
    const evidence = await Evidence.findByIdAndUpdate(
      req.params.id,
      { isNew: false },
      { new: true }
    );

    if (!evidence) {
      return res.status(404).json({ message: 'Evidence not found' });
    }

    res.status(200).json(evidence);
  } catch (error) {
    console.error('Error updating evidence:', error);
    res.status(500).json({ message: 'Error updating evidence', error: error.message });
  }
});

export default router;
