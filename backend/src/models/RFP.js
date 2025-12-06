const mongoose = require('mongoose');

const rfpSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  requirements: [String],
  deadline: Date,
  budget: Number,
  contactEmail: String,
  status: {
    type: String,
    enum: ['draft', 'sent', 'closed'],
    default: 'draft'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RFP', rfpSchema);