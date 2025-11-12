import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EnterpriseEntity } from 'src/enterprise/entity/enterprise.entity';
import { UsersEntity } from 'src/users/entity/users.entity';
import { RegisterEnterpriseDto } from './DTOs/register.dto';
import { LoginUser } from './DTOs/login.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async registerEnterprise(
    @Body() request: RegisterEnterpriseDto,
  ): Promise<{
    enterprise: EnterpriseEntity;
    owner: UsersEntity;
  }> {
    return await this.authService.registerEnterprise(request);
  }

  @Post('login')
  public async login(
    @Body() request: LoginUser,
  ): Promise<{ access_token: string }> {
    return await this.authService.login(request);
  }
}
