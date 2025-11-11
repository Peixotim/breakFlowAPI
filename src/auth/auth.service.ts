import { Injectable } from '@nestjs/common';
import { EnterpriseService } from 'src/enterprise/enterprise.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly enterpriseService: EnterpriseService,
    private readonly usersService: UsersService,
  ) {}
}
