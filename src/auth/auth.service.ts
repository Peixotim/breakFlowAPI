import {
  Injectable,
  ConflictException,
  Logger,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { EnterpriseService } from 'src/enterprise/enterprise.service';
import { UsersService } from 'src/users/users.service';
import { DataSource } from 'typeorm';
import { RegisterEnterpriseDto } from './DTOs/register-enterprise.dto';
import { EnterpriseEntity } from 'src/enterprise/entity/enterprise.entity';
import { UsersEntity } from 'src/users/entity/users.entity';
import { UsersRoles } from 'src/users/entity/users.roles';
import { LoginUser } from './DTOs/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterEmployee } from './DTOs/register-employee';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly enterpriseService: EnterpriseService,
    private readonly usersService: UsersService,
    private dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {}

  public async registerEnterprise(
    request: RegisterEnterpriseDto,
  ): Promise<{ enterprise: EnterpriseEntity; owner: UsersEntity }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newEnterprise: EnterpriseEntity =
        await this.enterpriseService._createWithManager(
          request.enterprise,
          queryRunner.manager,
        );

      const ownerRequest = {
        ...request.owner, //Spread Operator (Para copiar e colar os dados do request.owner)
        role: UsersRoles.OWNER, //Acessa a role e define ela como UsersRoles.OWNER
      };

      const newOwner: UsersEntity = await this.usersService._createWithManager(
        ownerRequest,
        queryRunner.manager,
      );

      newOwner.enterprise = newEnterprise; //Define a relação de newOwner com newEnterprise
      await queryRunner.manager.save(newOwner);
      await queryRunner.commitTransaction();

      //Observação de feature : Remover do retorno a senha do Owner
      return { enterprise: newEnterprise, owner: newOwner };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof ConflictException) {
        throw error;
      }

      this.logger.error(
        `Failed to register company. DTO:${JSON.stringify(request)}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        'Unexpected error when registering the company',
      );
    } finally {
      await queryRunner.release();
    }
  }

  public async login(request: LoginUser): Promise<{ access_token: string }> {
    const user = await this.usersService.findByMail(request.mail);

    const isMatch = user
      ? await bcrypt.compare(request.password, user.password)
      : false;

    if (!isMatch || !user) {
      throw new UnauthorizedException(
        'Error: The data provided is incorrect ! ',
      );
    }

    const payload = {
      sub: user.uuid,
      email: user.mail,
      role: user.role,
      enterpriseId: user.enterprise?.uuid,
    };
    const token = await this.jwtService.signAsync(payload);
    return {
      access_token: token,
    };
  }

  public async registerEmployee(
    request: RegisterEmployee,
  ): Promise<UsersEntity> {
    const enterprise: EnterpriseEntity =
      await this.enterpriseService.findByCnpj(request.cnpj);
    if (!enterprise) {
      throw new NotFoundException(
        'Error, the company with this cnpj does not exist!',
      );
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const employee = {
        ...request.employee,
        role: UsersRoles.EMPLOYEE,
      };
      const newEmployee: UsersEntity =
        await this.usersService._createWithManager(
          employee,
          queryRunner.manager,
        );

      newEmployee.enterprise = enterprise;
      await queryRunner.manager.save(newEmployee);
      await queryRunner.commitTransaction();

      newEmployee.password = '';
      return newEmployee;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof ConflictException) {
        throw error;
      }

      this.logger.error(
        `Failed to register an employee. DTO: ${JSON.stringify(request)}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        'Unexpected error when registering an employee',
      );
    } finally {
      await queryRunner.release();
    }
  }
}
