import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './entity/users.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this._createWithManager(request, queryRunner.manager);
      await queryRunner.commitTransaction();
      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(
        `Failed to create user: ${error}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException('Unexpected error creating user.');
    } finally {
      await queryRunner.release();
    }
  }

  public async _createWithManager(
    request: CreateUser,
    manager: EntityManager,
  ): Promise<UsersEntity> {
    const mailExists = await manager.existsBy(UsersEntity, {
      mail: request.mail,
    });
    if (mailExists) {
      throw new ConflictException(
        `Error: The email '${request.mail}' is already registered.`,
      );
    }

    const cpfExists = await manager.existsBy(UsersEntity, { cpf: request.cpf });
    if (cpfExists) {
      throw new ConflictException(
        `Error: The CPF entered is already registered.`,
      );
    }

    const saltRounds: number = 12;
    const salt: string = await bcrypt.genSalt(saltRounds);
    const hash: string = await bcrypt.hash(request.password, salt);

    const newUser: UsersEntity = manager.create(UsersEntity, {
      ...request,
      password: hash,
    });

    const saved: UsersEntity = await manager.save(newUser);
    //Observação de feature : Remover do retorno a senha do User
    return saved;
  }

  public async findByMail(mail: string): Promise<UsersEntity | null> {
    if (!mail?.trim()) {
      throw new BadRequestException('The email field cannot be empty.');
    }
    const email = mail.trim().toLowerCase();
    const user = await this.userRepository.findOneBy({ mail: email });
    if (!user) {
      return null; //Nao posso personalizar o erro por conta de seguranca
    }
    return user;
  }
}
