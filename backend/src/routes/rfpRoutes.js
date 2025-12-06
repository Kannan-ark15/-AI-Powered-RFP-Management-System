const express = require('express');
const router = express.Router();
const rfpController = require('../controllers/rfpController');

router.post('/', rfpController.createRFP);
router.get('/', rfpController.getAllRFPs);
router.get('/:id', rfpController.getRFPById);
router.put('/:id', rfpController.updateRFP);
router.post('/:id/send', rfpController.sendRFP);

module.exports = router;