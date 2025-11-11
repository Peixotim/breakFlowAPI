import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnterpriseEntity } from './entity/enterprise.entity';
import { DataSource, Repository } from 'typeorm';
import { EnterpriseCreate } from './DTOs/enterprise-create.dto';

@Injectable()
export class EnterpriseService {
  private readonly logger = new Logger(EnterpriseService.name);
  constructor(
    @InjectRepository(EnterpriseEntity)
    private readonly enterpriseRepository: Repository<EnterpriseEntity>,
    private dataSource: DataSource,
  ) {}

  public async createEnterprise(
    request: EnterpriseCreate,
  ): Promise<EnterpriseEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cnpjExists = await queryRunner.manager.existsBy(EnterpriseEntity, {
        cnpj: request.cnpj,
      });

      if (cnpjExists) {
        throw new HttpException(
          `Error: A company with this CNPJ already exists !`,
          HttpStatus.CONFLICT,
        );
      }

      //Se possuir o campo contactMail preenchido entra no if
      if (request.contactMail) {
        const contactMailExists = await queryRunner.manager.existsBy(
          EnterpriseEntity,
          {
            contactMail: request.contactMail,
          },
        );

        if (contactMailExists) {
          throw new HttpException(
            `Error: A company with this email address already exists!`,
            HttpStatus.CONFLICT,
          );
        }
      }
      const newEnterprise: EnterpriseEntity = queryRunner.manager.create(
        EnterpriseEntity,
        request,
      );

      const saved: EnterpriseEntity =
        await queryRunner.manager.save(newEnterprise);
      await queryRunner.commitTransaction();
      return saved;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.logger.error(
        `Falha ao criar nova empresa. Erro: ${error}`,
        (error as Error).stack,
      );

      if (error instanceof ConflictException) {
        throw new HttpException(
          `Error, there was a conflict while registering , verify logs`,
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        `Error, unexpected`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
