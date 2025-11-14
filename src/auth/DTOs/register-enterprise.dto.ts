import { ValidateNested } from 'class-validator';
import { EnterpriseCreate } from 'src/enterprise/DTOs/enterprise-create.dto';
import { CreateUser } from 'src/users/DTOs/users-create.dto';
import { Type } from 'class-transformer';
export class RegisterEnterpriseDto {
  @ValidateNested()
  @Type(() => EnterpriseCreate)
  enterprise: EnterpriseCreate;

  @ValidateNested()
  @Type(() => CreateUser)
  owner: CreateUser;
}
