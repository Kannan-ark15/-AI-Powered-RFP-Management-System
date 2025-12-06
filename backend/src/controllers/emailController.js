const aiService = require('../services/ai/aiService');
const Proposal = require('../models/Proposal');
const Vendor = require('../models/Vendor');

exports.receiveEmailHook = async (req, res) => {
  try {
    const { from, subject, body, rfpId } = req.body;

    let vendor = await Vendor.findOne({ email: from });
    if (!vendor) {
      vendor = new Vendor({
        name: from.split('@')[0],
        email: from,
        company: from.split('@')[1]
      });
      await vendor.save();
    }

    const parsedData = await aiService.parseProposal(body);

    const proposal = new Proposal({
      rfpId,
      vendorId: vendor._id,
      vendorEmail: from,
      subject,
      body,
      parsedData
    });

    await proposal.save();

    res.json({ message: 'Proposal received and parsed', proposal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};