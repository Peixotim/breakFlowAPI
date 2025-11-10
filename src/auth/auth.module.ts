import { Module } from '@nestjs/common';
import { EnterpriseModule } from 'src/enterprise/enterprise.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [EnterpriseModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
