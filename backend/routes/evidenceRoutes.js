import express from 'express';
import { simpleAuth } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  receiveFromHardware,
  getAllEvidence,
  getEvidenceById,
  updateEvidence,
  deleteEvidence,
  markEvidenceViewed,
  uploadImagesForEvidence
} from '../controller/evidenceController.js';

const router = express.Router();

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).substr(2,9)}${ext}`;
    cb(null, name);
  }
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/hardware', receiveFromHardware);
router.get('/', simpleAuth, getAllEvidence);
router.get('/:id', simpleAuth, getEvidenceById);
router.put('/:id', simpleAuth, updateEvidence);
router.delete('/:id', simpleAuth, deleteEvidence);
router.patch('/:id/mark-viewed', simpleAuth, markEvidenceViewed);

// ✅ Upload images for a specific evidence
router.post('/:id/images', simpleAuth, upload.array('images', 10), uploadImagesForEvidence);

export default router;
