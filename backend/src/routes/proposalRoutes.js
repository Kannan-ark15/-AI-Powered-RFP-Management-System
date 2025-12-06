const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/proposalController');

router.post('/by-rfp', proposalController.getProposalsByRFP);

module.exports = router;