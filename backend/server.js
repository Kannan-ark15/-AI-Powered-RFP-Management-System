require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const rfpRoutes = require('./src/routes/rfpRoutes');
const vendorRoutes = require('./src/routes/vendorRoutes');
const proposalRoutes = require('./src/routes/proposalRoutes');
const emailRoutes = require('./src/routes/emailRoutes');
const aiRoutes = require('./src/routes/aiRoutes');

const receiveEmailService = require('./src/services/email/receiveEmailService');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/rfps', rfpRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  receiveEmailService.startPolling();
});