const aiService = require('../services/ai/aiService');
const Proposal = require('../models/Proposal');

exports.parseRFP = async (req, res) => {
  try {
    const { naturalLanguageText } = req.body;
    const parsedRFP = await aiService.parseRFP(naturalLanguageText);
    res.json(parsedRFP);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.parseProposal = async (req, res) => {
  try {
    const { emailBody } = req.body;
    const parsedProposal = await aiService.parseProposal(emailBody);
    res.json(parsedProposal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.compareProposals = async (req, res) => {
  try {
    const { rfpId } = req.body;
    const proposals = await Proposal.find({ rfpId }).populate('vendorId');
    
    if (proposals.length === 0) {
      return res.json({ comparison: [], recommendation: 'No proposals to compare' });
    }

    const comparison = await aiService.compareProposals(proposals);
    res.json(comparison);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};