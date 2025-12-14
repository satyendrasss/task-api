const nodemailer = require("nodemailer");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || "smtp.gmail.com",
      port: process.env.MAIL_PORT || 465,
      secure: true, // For SSL
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendMail({ to, subject, text, html, cc, bcc, attachments }) {
    try {
      const mailOptions = {
        from: process.env.MAIL_FROM || `"SK Support" <${process.env.MAIL_USER}>`,
        to,
        subject,
        text,
        html,
        cc,
        bcc,
        attachments,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log("Email sent:", result.messageId);
      return result;
    } catch (err) {
      console.error("Mail Send Error:", err);
      throw err;
    }
  }
}

module.exports = new MailService();
