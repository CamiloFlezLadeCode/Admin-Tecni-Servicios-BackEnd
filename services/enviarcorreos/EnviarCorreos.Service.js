const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com',
  port: 587,
  auth: {
    user: process.env.RESEND_USER,
    pass: process.env.RESEND_PASS
  }
});

async function enviarRemision({ destinatario, asunto, html, rutaPDF }) {
  const mailOptions = {
    from: `"Tecniservicios" <${process.env.RESEND_USER}>`,
    to: destinatario,
    subject: asunto,
    html,
    attachments: [
      {
        filename: 'remision.pdf',
        path: rutaPDF,
        contentType: 'application/pdf'
      }
    ]
  };

  await transporter.sendMail(mailOptions);
  console.log('📧 Remisión enviada a:', destinatario);
}

module.exports = { enviarRemision };
