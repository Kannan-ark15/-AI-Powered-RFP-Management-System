const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/parse-rfp', aiController.parseRFP);
router.post('/parse-proposal', aiController.parseProposal);
router.post('/compare', aiController.compareProposals);

module.exports = router;