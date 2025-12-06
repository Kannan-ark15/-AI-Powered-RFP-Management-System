const imaps = require('imap-simple');
const aiService = require('../ai/aiService');
const Proposal = require('../../models/Proposal');
const Vendor = require('../../models/Vendor');
const RFP = require('../../models/RFP');

const config = {
  imap: {
    user: process.env.IMAP_USER,
    password: process.env.IMAP_PASS,
    host: process.env.IMAP_HOST,
    port: process.env.IMAP_PORT,
    tls: true,
    authTimeout: 10000
  }
};

let pollingInterval;

async function checkEmails() {
  try {
    const connection = await imaps.connect(config);
    await connection.openBox('INBOX');

    const searchCriteria = ['UNSEEN'];
    const fetchOptions = {
      bodies: ['HEADER', 'TEXT'],
      markSeen: true
    };

    const messages = await connection.search(searchCriteria, fetchOptions);

    for (const item of messages) {
      const header = item.parts.find(p => p.which === 'HEADER');
      const body = item.parts.find(p => p.which === 'TEXT');

      if (!header || !body) continue;

      const from = header.body.from?.[0] || '';
      const subject = header.body.subject?.[0] || '';
      const emailBody = body.body || '';

      const fromEmail = extractEmail(from);

      let vendor = await Vendor.findOne({ email: fromEmail });
      if (!vendor) {
        vendor = new Vendor({
          name: fromEmail.split('@')[0],
          email: fromEmail,
          company: fromEmail.split('@')[1]
        });
        await vendor.save();
      }

      const rfp = await findRelatedRFP(subject);
      if (!rfp) continue;

      const parsedData = await aiService.parseProposal(emailBody);

      const proposal = new Proposal({
        rfpId: rfp._id,
        vendorId: vendor._id,
        vendorEmail: fromEmail,
        subject,
        body: emailBody,
        parsedData
      });

      await proposal.save();
      console.log(`Proposal saved from ${fromEmail}`);
    }

    connection.end();
  } catch (error) {
    console.error('Email polling error:', error);
  }
}

function extractEmail(fromString) {
  const match = fromString.match('//') || fromString.match(/(\S+@\S+)/);
  return match ? match[1] : fromString;
}

async function findRelatedRFP(subject) {
  const rfps = await RFP.find({ status: 'sent' });
  for (const rfp of rfps) {
    if (subject.toLowerCase().includes(rfp.title.toLowerCase())) {
      return rfp;
    }
  }
  return rfps[0];
}

exports.startPolling = () => {
  const interval = parseInt(process.env.IMAP_POLL_INTERVAL || '60') * 1000;
  
  pollingInterval = setInterval(() => {
    checkEmails();
  }, interval);

  console.log(`Email polling started (interval: ${interval}ms)`);
};

exports.stopPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    console.log('Email polling stopped');
  }
};