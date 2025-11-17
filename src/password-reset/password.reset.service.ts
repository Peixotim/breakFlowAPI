import { Injectable, NotFoundException } from '@nestjs/common';
import { RequestMailForgotPassword } from './DTOs/password-reset.dto';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class PasswordResetService {
  constructor(private readonly userService: UsersService) {}

  public async forgotPassword(request: RequestMailForgotPassword) {
    const user = await this.userService.findByMail(request.mail);
    if (!user) {
      throw new NotFoundException('Error, the email entered is invalid!');
    }
  }
}
