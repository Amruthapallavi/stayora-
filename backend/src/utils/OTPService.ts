import nodemailer from "nodemailer";



class OTPService {
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  async sendOTP(email: string, otp: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    console.log('checking')
   
        await transporter.sendMail({
          
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP",
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    });
    console.log("sending issue")
  }
  
}

export default new OTPService();