import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [MailController],
  providers: [MailService],
  imports: [UsersService],
})
export class MailModule {}
