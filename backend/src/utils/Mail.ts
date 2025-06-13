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

    } catch (error) {
      console.error(" Error sending rejection email:", error);
    }
  }
  async sendApprovalMail(email: string,owner:string): Promise<void> {
  try {
    await this.transporter.sendMail({
      from: `"STAYORA Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "ID Proof Verified - Welcome to STAYORA!",
      html: `
        <p>Dear ${owner},</p>
        <p>We’re happy to inform you that your ID Proof has been successfully verified.</p>
        <p>You can now log in to your account and continue exploring all the features stayOra has to offer.</p>
        <p>If you're a property owner, you can begin listing your properties and managing your bookings with ease.</p>
        <p>Welcome to the StayOra community — we’re excited to have you on board!</p>
        <p>Best regards,<br>STAYORA Team</p>
      `,
    });

  } catch (error) {
    console.error("Error sending approval email:", error);
  }
}

}

export default new MailService();
