import nodemailer from "nodemailer";

class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendRejectionMail(email: string, reason: string): Promise<void> {
    try {

      await this.transporter.sendMail({
        from: `"STAYORA Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "ID Proof Rejected",
        html: `
          <p>Dear User,</p>
          <p>We regret to inform you that your ID Proof verification is failed.</p>
          <p><strong>Reason:</strong> ${reason}</p>
          <p>If you believe this was a mistake,reupload it by login your account or please contact support.</p>
          <p>Best regards,<br>Tick-Track Team</p>
        `,
      });

      console.log(" Rejection email sent successfully!");
    } catch (error) {
      console.error(" Error sending rejection email:", error);
    }
  }
}

export default new MailService();
