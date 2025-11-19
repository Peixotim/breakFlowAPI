import {
  UnauthorizedException,
  Body,
  Controller,
  Headers,
  Patch,
} from '@nestjs/common';
import { ModifyUserDTO } from './DTOs/user-modify.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Patch('modifyUser')
  public async modifyUser(
    @Headers('authorization') authHeader: string, //Recebe a sessionToken
    @Body() request: ModifyUserDTO,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Token not found in request headers');
    }
    const accessToken = authHeader.split(' ')[1];
    return await this.userService.modifyAccount(accessToken, request);
  }
}
