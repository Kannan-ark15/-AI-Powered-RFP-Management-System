const RFP = require('../models/RFP');

exports.createRFP = async (req, res) => {
  try {
    const rfp = new RFP(req.body);
    await rfp.save();
    res.status(201).json(rfp);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllRFPs = async (req, res) => {
  try {
    const rfps = await RFP.find().sort({ createdAt: -1 });
    res.json(rfps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRFPById = async (req, res) => {
  try {
    const rfp = await RFP.findById(req.params.id);
    if (!rfp) {
      return res.status(404).json({ error: 'RFP not found' });
    }
    res.json(rfp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRFP = async (req, res) => {
  try {
    const rfp = await RFP.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!rfp) {
      return res.status(404).json({ error: 'RFP not found' });
    }
    res.json(rfp);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.sendRFP = async (req, res) => {
  try {
    const { vendorIds } = req.body;
    const rfp = await RFP.findById(req.params.id);
    
    if (!rfp) {
      return res.status(404).json({ error: 'RFP not found' });
    }

    const Vendor = require('../models/Vendor');
    const vendors = await Vendor.find({ _id: { $in: vendorIds } });
    
    const sendEmailService = require('../services/email/sendEmailService');
    
    for (const vendor of vendors) {
      await sendEmailService.sendRFPEmail(rfp, vendor);
    }

    rfp.status = 'sent';
    await rfp.save();

    res.json({ message: 'RFP sent successfully', rfp });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};