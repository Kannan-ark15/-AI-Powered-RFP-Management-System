const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  rfpId: { type: mongoose.Schema.Types.ObjectId, ref: 'RFP', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  vendorEmail: String,
  subject: String,
  body: String,
  parsedData: {
    proposedCost: Number,
    timeline: String,
    keyFeatures: [String],
    experience: String,
    teamSize: Number
  },
  score: Number,
  recommendation: String,
  receivedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Proposal', proposalSchema);