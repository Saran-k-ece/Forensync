import mongoose from 'mongoose';

const evidenceSchema = new mongoose.Schema({
  evidenceId: { type: String, required: true, unique: true },
  tagId: { type: String, required: true },
  evidenceName: { type: String, required: true },
  evidenceType: { 
    type: String, 
    enum: ['Physical','Digital','Documentary','Biological','Chemical','Trace','Audio/Visual'], 
    required: true 
  },
  timestamp: { type: Date, default: Date.now },
  location: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Collected','In Transit','Stored','Under Analysis','Released'], 
    default: 'Collected' 
  },
  description: { type: String, default: '' },
  images: { type: [String], default: [] },
  isNew: { type: Boolean, default: true },

  // NEW FIELDS
  submittedBy: { type: String, default: 'N/A' },
  officerName: { type: String, default: 'N/A' },
  complainantName: { type: String, default: 'N/A' },
  contact: { type: String, default: 'N/A' },
  chainOfCustody: { type: String, default: 'N/A' },
}, {
  timestamps: true
});


const Evidence = mongoose.model('Evidence', evidenceSchema);

export default Evidence;
