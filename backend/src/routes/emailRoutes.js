const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

router.post('/receive-hook', emailController.receiveEmailHook);

module.exports = router;