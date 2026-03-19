import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
// backend/src/services/mail.service.ts
@Injectable()
export class MailService {
  // dịch vụ gửi mail

  private transporter: nodemailer.Transporter;

  private adminSystem = process.env.EMAIL_USER;

  constructor() {
    this.transporter = nodemailer.createTransport({
      //   service: 'gmail', // Hoặc dịch vụ email bạn sử dụng
      //   host: 'smtp.ethereal.email',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use true for port 465, false for port 587
      auth: {
        // user: 'cordell.gibson@ethereal.email',
        // pass: 'qvxXfsJGQnAWBqE6a7',

        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  //   hàm gửi reset password về mail
  async sendPasswordResetEmail(to: string, token: string) {
    const url_client = process.env.URL_CLIENT;
    const resetLink = `${url_client}/reset-password?token=${token}`;

    const mailOptions = {
      from: 'Auth-backend service',
      to: to,
      subject: 'Password Reset Request',

      html: `
        <p>You requested a password reset.</p>
        <p>
          <a href="${resetLink}">Đặt lại mật khẩu</a>
        </p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  //
  async sendOtpEmail(to: string, otp: string) {
    const urlClient = process.env.URL_CLIENT;
    const verifyPath = process.env.URL_VERIFY_OTP;

    const verifyLink = `${urlClient}${verifyPath}?email=${to}`;

    const otpMail = {
      from: `Quản lý chi tiêu NBT ${this.adminSystem}`,
      to: to,
      subject: 'Xác thực email - Quản lý chi tiêu NBT',
      html: `
      <div style="font-family: Arial, sans-serif; padding:20px; background:#f6f6f6;">
        
        <div style="max-width:500px; margin:auto; background:white; padding:30px; border-radius:8px;">
          
          <h2 style="color:#2c3e50; text-align:center;">
            Hotel NBT
          </h2>

          <p>Xin chào,</p>

          <p>Bạn vừa yêu cầu xác thực email cho tài khoản tại <b>Quản lý chi tiêu NBT</b>.</p>

          <p>Mã OTP của bạn là:</p>

          <h1 style="
            text-align:center;
            letter-spacing:5px;
            background:#f1f1f1;
            padding:15px;
            border-radius:6px;
            color:#e74c3c;
          ">
            ${otp}
          </h1>

          <p>Hoặc nhấn link sau để nhập OTP:</p>

          <a href="${verifyLink}">
            Xác thực tài khoản
          </a>
          
          <p>Mã OTP này sẽ hết hạn sau <b>5 phút</b>.</p>

          <p>Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email.</p>

          <hr style="margin:30px 0">

          <p style="font-size:12px; color:gray;">
            © ${new Date().getFullYear()} Hotel NBT. All rights reserved.
          </p>

        </div>
      </div>
    `,
    };

    await this.transporter.sendMail(otpMail);
  }
}
