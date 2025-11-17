import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT || 465),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  public async sendMail(to: string, subject: string, content: string) {
    const MailOptions = {
      from: `"No Reply" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      text: content,
    };

    await this.transporter.sendMail(MailOptions);
  }
}
