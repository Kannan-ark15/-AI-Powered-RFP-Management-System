const Proposal = require('../models/Proposal');

exports.getProposalsByRFP = async (req, res) => {
  try {
    const { rfpId } = req.body;
    const proposals = await Proposal.find({ rfpId })
      .populate('vendorId')
      .sort({ receivedAt: -1 });
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};