import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './entity/users.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUser } from './DTOs/users-create.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
    private dataSource: DataSource,
  ) {}
  private readonly logger = new Logger(UsersService.name);

  public async createUser(request: CreateUser): Promise<UsersEntity> {
    const saltRounds: number = 12;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const mailExists = await queryRunner.manager.existsBy(UsersEntity, {
        mail: request.mail,
      });
      const cpfExists = await queryRunner.manager.existsBy(UsersEntity, {
        cpf: request.cpf,
      });

      if (mailExists) {
        throw new ConflictException(
          `Error: The email '${request.mail}' is already registered.`,
        );
      }

      if (cpfExists) {
        throw new ConflictException(
          `Error: The CPF entered is already registered.`,
        );
      }

      const salt: string = await bcrypt.genSalt(saltRounds);
      const hash: string = await bcrypt.hash(request.password, salt);

      const newUser: UsersEntity = queryRunner.manager.create(UsersEntity, {
        ...request, // spread Operator(Copia os dados do request)
        password: hash, // E sobrescreve o 'password' com o hash
      });

      const saved: UsersEntity = await queryRunner.manager.save(newUser);
      await queryRunner.commitTransaction();

      return saved;
    } catch (error: unknown) {
      await queryRunner.rollbackTransaction();

      if (error instanceof ConflictException) {
        throw error;
      }

      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to create user. DTO:${JSON.stringify(request)}`,
        stack,
      );

      throw new HttpException(
        'Unexpected error when creating the user.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
