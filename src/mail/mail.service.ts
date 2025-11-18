import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger();

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

  public async sendMail(
    to: string,
    subject: string,
    content: string,
    htmlContent?: string,
  ) {
    try {
      const MailOptions = {
        from: `"BreakFlow" <${process.env.EMAIL_FROM}>`,
        to,
        subject,
        text: content,
        html: htmlContent || content,
      };

      await this.transporter.sendMail(MailOptions);

      this.logger.log(`Email sent to ${to}`);
    } catch (error: unknown) {
      this.logger.error(
        `Failed to send email to ${to}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException('Error sending email service');
    }
  }
}
