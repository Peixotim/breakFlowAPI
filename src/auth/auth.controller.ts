import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EnterpriseEntity } from 'src/enterprise/entity/enterprise.entity';
import { UsersEntity } from 'src/users/entity/users.entity';
import { RegisterEnterpriseDto } from './DTOs/register.dto';
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
}
