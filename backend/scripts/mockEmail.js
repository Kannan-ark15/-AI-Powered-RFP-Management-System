require('dotenv').config();
const axios = require('axios');

const API_URL = `http://localhost:${process.env.PORT || 4000}/api`;

async function sendMockProposal() {
  const rfpId = process.argv[2];
  
  if (!rfpId) {
    console.error('Usage: node mockEmail.js ');
    process.exit(1);
  }

  const mockProposal = {
    from: 'vendor@techsolutions.com',
    subject: 'Proposal for E-commerce Platform Development',
    body: `
      Dear Project Manager,
      
      We are excited to submit our proposal for your e-commerce platform project.
      
      Proposed Cost: $65,000
      Timeline: 16 weeks
      
      Key Features We'll Deliver:
      - Advanced shopping cart with saved items
      - Stripe and PayPal integration
      - Comprehensive admin dashboard with analytics
      - Fully responsive mobile design
      - SEO optimization
      
      Our Experience:
      We have 12+ years of experience building e-commerce platforms, having completed 50+ successful projects.
      
      Team: 6 dedicated developers (2 backend, 2 frontend, 1 designer, 1 QA)
      
      We look forward to working with you!
      
      Best regards,
      Tech Solutions Inc
    `,
    rfpId
  };

  try {
    const response = await axios.post(`${API_URL}/email/receive-hook`, mockProposal);
    console.log('Mock proposal sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending mock proposal:', error.response?.data || error.message);
  }
}

sendMockProposal();