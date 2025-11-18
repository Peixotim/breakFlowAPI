import { Module } from '@nestjs/common';
import { PasswordResetService } from './password.reset.service';
import { PasswordController } from './password-reset.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetEntity } from './entity/password-reset.entity';
import { MailModule } from 'src/mail/mail.module';
import { UsersService } from 'src/users/users.service';
@Module({
  controllers: [PasswordController],
  providers: [PasswordResetService],
  imports: [
    TypeOrmModule.forFeature([PasswordResetEntity]),
    MailModule,
    UsersService,
  ],
})
export class PasswordReset {}
