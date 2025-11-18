import { Injectable, NotFoundException } from '@nestjs/common';
import { RequestMailForgotPassword } from './DTOs/password-reset.dto';
import { UsersService } from 'src/users/users.service';
import { randomInt } from 'crypto';
import { PasswordResetEntity } from './entity/password-reset.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from 'src/mail/mail.service';
@Injectable()
export class PasswordResetService {
  constructor(
    @InjectRepository(PasswordResetEntity)
    private readonly passwordResetRepository: Repository<PasswordResetEntity>,
    private readonly userService: UsersService,
    private readonly mailService: MailService,
  ) {}

  public async forgotPassword(request: RequestMailForgotPassword) {
    const user = await this.userService.findByMail(request.mail);

    if (!user) {
      throw new NotFoundException('Error, the email entered is invalid!');
    }

    const code = randomInt(100000, 999999);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const newPasswordReset = this.passwordResetRepository.create({
      user: user,
      used: false,
      codeGenerator: code,
      expiresAt: expiresAt,
    });

    await this.passwordResetRepository.save(newPasswordReset);

    const emailHtml = this.generateEmailTemplate(user.name, code);

    return this.mailService.sendMail(
      request.mail,
      'Redefinição de Senha - BreakFlow',
      `Seu código de recuperação é: ${code}`,
      emailHtml,
    );
  }

  private generateEmailTemplate(userName: string, code: number): string {
    const currentYear = new Date().getFullYear();

    const bgDark = '#09090b';
    const cardBg = '#121214';
    const neonGreen = '#89F336';
    const textWhite = '#EDEDED';
    const textGray = '#9A9A9A';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          /* Reset básico para clientes de e-mail */
          body { margin: 0; padding: 0; background-color: ${bgDark}; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
          table { border-spacing: 0; }
          td { padding: 0; }
          img { border: 0; }
          .wrapper { width: 100%; table-layout: fixed; background-color: ${bgDark}; padding-bottom: 40px; }
          .main { background-color: ${cardBg}; margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; font-family: sans-serif; color: ${textWhite}; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); }
        </style>
      </head>
      <body>
        <center class="wrapper">
          <table class="main" width="100%">
            
            <tr>
              <td style="padding: 40px 0 30px 0; text-align: center;">
                <div style="display: inline-block; padding: 12px; background: rgba(137, 243, 54, 0.1); border-radius: 12px; border: 1px solid rgba(137, 243, 54, 0.2);">
                   <span style="font-size: 24px;">🥑</span>
                </div>
                <div style="margin-top: 10px; font-size: 20px; font-weight: bold; color: ${textWhite}; letter-spacing: -0.5px;">BreakFlow</div>
              </td>
            </tr>

            <tr>
              <td style="padding: 0 40px;">
                <h1 style="margin: 0 0 20px 0; font-size: 24px; font-weight: bold; text-align: center;">Recuperação de Acesso</h1>
                
                <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: ${textGray}; text-align: center;">
                  Olá, <strong>${userName}</strong>. Recebemos uma solicitação para redefinir a senha da sua conta.
                </p>
                
                <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: ${textGray}; text-align: center;">
                  Use o código abaixo para completar o processo. Este código expira em <strong>10 minutos</strong>.
                </p>

                <table width="100%">
                  <tr>
                    <td style="text-align: center; padding: 20px 0;">
                      <div style="
                        display: inline-block;
                        background-color: rgba(0,0,0,0.3);
                        border: 1px solid rgba(255,255,255,0.1);
                        border-radius: 12px;
                        padding: 20px 40px;
                        text-align: center;
                      ">
                        <span style="
                          font-family: 'Courier New', monospace;
                          font-size: 36px;
                          font-weight: bold;
                          letter-spacing: 8px;
                          color: ${neonGreen};
                          display: block;
                        ">${code}</span>
                      </div>
                    </td>
                  </tr>
                </table>

                <p style="margin: 30px 0 10px 0; font-size: 14px; color: ${textGray}; text-align: center;">
                  Se você não solicitou essa alteração, pode ignorar este e-mail com segurança.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding: 40px; text-align: center;">
                <div style="height: 1px; background-color: rgba(255,255,255,0.05); margin-bottom: 30px;"></div>
                <p style="margin: 0; font-size: 12px; color: #555;">
                  &copy; ${currentYear} BreakFlow Security System.<br>
                  São Paulo, Brasil.
                </p>
              </td>
            </tr>

          </table>
        </center>
      </body>
      </html>
    `;
  }
}
