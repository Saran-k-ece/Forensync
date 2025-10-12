import mongoose from 'mongoose';

const evidenceSchema = new mongoose.Schema({
  evidenceId: {
    type: String,
    required: true,
    unique: true
  },
  tagId: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Collected', 'In Transit', 'Stored', 'Under Analysis', 'Released'],
    default: 'Collected'
  },
  description: {
    type: String,
    default: ''
  },
  isNew: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Evidence = mongoose.model('Evidence', evidenceSchema);

export default Evidence;
