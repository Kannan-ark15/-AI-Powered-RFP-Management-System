const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

exports.sendRFPEmail = async (rfp, vendor) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: vendor.email,
    subject: `RFP: ${rfp.title}`,
    html: `
      ${rfp.title}
      ${rfp.description}
      Requirements:
      
        ${rfp.requirements.map(r => `${r}`).join('')}
      
      Deadline: ${new Date(rfp.deadline).toLocaleDateString()}
      Budget: $${rfp.budget?.toLocaleString() || 'TBD'}
      Contact: ${rfp.contactEmail}
      Please reply to this email with your proposal.
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`RFP sent to ${vendor.email}`);
  } catch (error) {
    console.error(`Failed to send RFP to ${vendor.email}:`, error);
    throw error;
  }
};