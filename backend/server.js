import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import evidenceRoutes from './routes/evidenceRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Digital Forensics Evidence Management API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/login',
      hardware: '/api/evidence/hardware (POST - no auth required)',
      evidence: '/api/evidence (GET, POST, PUT, DELETE - auth required)'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/evidence', evidenceRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
  console.log(`🔐 Admin credentials: ${process.env.ADMIN_USERNAME} / ${process.env.ADMIN_PASSWORD}`);
});
