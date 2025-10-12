import express from 'express';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', authenticateAdmin, (req, res) => {
  res.status(200).json({
    message: 'Login successful',
    token: 'authenticated',
    username: req.body.username
  });
});

export default router;
