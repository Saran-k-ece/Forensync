import express from 'express';
import { simpleAuth } from '../middleware/auth.js';
import {
  receiveFromHardware,
  getAllEvidence,
  getEvidenceById,
  updateEvidence,
  deleteEvidence,
  markEvidenceViewed
} from '../controller/evidenceController.js';

const router = express.Router();

// Evidence Routes
router.post('/hardware', receiveFromHardware);               
router.get('/', simpleAuth, getAllEvidence);                 
router.get('/:id', simpleAuth, getEvidenceById);            
router.put('/:id', simpleAuth, updateEvidence);               
router.delete('/:id', simpleAuth, deleteEvidence);           
router.patch('/:id/mark-viewed', simpleAuth, markEvidenceViewed); 

export default router;
