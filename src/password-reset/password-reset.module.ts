import { Module } from '@nestjs/common';
import { PasswordResetService } from './password.reset.service';
import { PasswordController } from './password-reset.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetEntity } from './entity/password-reset.entity';
import { MailModule } from 'src/mail/mail.module';
@Module({
  controllers: [PasswordController],
  providers: [PasswordResetService],
  imports: [TypeOrmModule.forFeature([PasswordResetEntity]), MailModule],
})
export class PasswordReset {}
