import { Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  //Envio de emails
  @Post('send-mail')
  public async sendMail(
    to: string,
    subject: string,
    content: string,
    htmlContent?: string,
  ) {
    return await this.mailService.sendMail(to, subject, content, htmlContent);
  }
}
