const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.html
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

const sendApplicationNotification = async (employerEmail, jobTitle, applicantName) => {
  const html = `
    <h2>New Job Application</h2>
    <p>You have received a new application for the position: <strong>${jobTitle}</strong></p>
    <p>Applicant: <strong>${applicantName}</strong></p>
    <p>Please log in to your dashboard to review the application.</p>
  `;

  await sendEmail({
    to: employerEmail,
    subject: `New Application for ${jobTitle}`,
    html
  });
};

const sendApplicationConfirmation = async (applicantEmail, jobTitle, companyName) => {
  const html = `
    <h2>Application Submitted Successfully</h2>
    <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been submitted successfully.</p>
    <p>We will notify you if there are any updates regarding your application.</p>
    <p>Good luck!</p>
  `;

  await sendEmail({
    to: applicantEmail,
    subject: `Application Confirmation - ${jobTitle}`,
    html
  });
};

module.exports = {
  sendEmail,
  sendApplicationNotification,
  sendApplicationConfirmation
};
