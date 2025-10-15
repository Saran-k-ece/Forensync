import Evidence from '../models/Evidence.js';
import path from 'path';

export const receiveFromHardware = async (req, res) => {
  try {
    const { tagId, location, status, description, evidenceName, evidenceType } = req.body;
    if (!tagId || !location || !evidenceName || !evidenceType) {
      return res.status(400).json({ message: 'Tag ID, location, evidence name, and evidence type are required' });
    }
    const evidenceId = `EV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const evidence = new Evidence({
      evidenceId,
      tagId,
      evidenceName,
      evidenceType,
      location,
      status: status || 'Collected',
      description: description || '',
      timestamp: new Date(),
      isNew: true,
      images: []
    });
    await evidence.save();
    res.status(201).json({ message: 'Evidence data received successfully', data: evidence });
  } catch (error) {
    console.error('Error saving evidence:', error);
    res.status(500).json({ message: 'Error saving evidence data', error: error.message });
  }
};

export const getAllEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.find().sort({ timestamp: -1 });
    res.status(200).json(evidence);
  } catch (error) {
    console.error('Error fetching evidence:', error);
    res.status(500).json({ message: 'Error fetching evidence', error: error.message });
  }
};

export const getEvidenceById = async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id);
    if (!evidence) return res.status(404).json({ message: 'Evidence not found' });
    res.status(200).json(evidence);
  } catch (error) {
    console.error('Error fetching evidence:', error);
    res.status(500).json({ message: 'Error fetching evidence', error: error.message });
  }
};

export const updateEvidence = async (req, res) => {
  try {
    const { status, location, description, evidenceName, evidenceType } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (location) updateData.location = location;
    if (description !== undefined) updateData.description = description;
    if (evidenceName) updateData.evidenceName = evidenceName;
    if (evidenceType) updateData.evidenceType = evidenceType;
    updateData.isNew = false;
    const evidence = await Evidence.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!evidence) return res.status(404).json({ message: 'Evidence not found' });
    res.status(200).json(evidence);
  } catch (error) {
    console.error('Error updating evidence:', error);
    res.status(500).json({ message: 'Error updating evidence', error: error.message });
  }
};

export const deleteEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.findByIdAndDelete(req.params.id);
    if (!evidence) return res.status(404).json({ message: 'Evidence not found' });
    res.status(200).json({ message: 'Evidence deleted successfully' });
  } catch (error) {
    console.error('Error deleting evidence:', error);
    res.status(500).json({ message: 'Error deleting evidence', error: error.message });
  }
};

export const markEvidenceViewed = async (req, res) => {
  try {
    const evidence = await Evidence.findByIdAndUpdate(req.params.id, { isNew: false }, { new: true });
    if (!evidence) return res.status(404).json({ message: 'Evidence not found' });
    res.status(200).json(evidence);
  } catch (error) {
    console.error('Error marking evidence viewed:', error);
    res.status(500).json({ message: 'Error updating evidence', error: error.message });
  }
};

export const uploadImagesForEvidence = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const host = req.get('host');
    const protocol = req.protocol;

    const urls = req.files.map(f => `${protocol}://${host}/uploads/${f.filename}`);

    const evidence = await Evidence.findById(req.params.id);
    if (!evidence) return res.status(404).json({ message: 'Evidence not found' });

    evidence.images = evidence.images.concat(urls);
    await evidence.save();

    res.status(200).json({ message: 'Images uploaded', images: evidence.images });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ message: 'Error uploading images', error: error.message });
  }
};
