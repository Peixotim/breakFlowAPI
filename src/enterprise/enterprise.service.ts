import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnterpriseEntity } from './entity/enterprise.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
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
      const enterprise = await this._createWithManager(
        request,
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();
      return enterprise;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof ConflictException) {
        throw error;
      }

      this.logger.error(
        `Failed to create new company. Error: ${error}`,
        (error as Error).stack,
      );

      throw new InternalServerErrorException(
        'Unexpected error when creating company.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  public async _createWithManager(
    request: EnterpriseCreate,
    manager: EntityManager,
  ): Promise<EnterpriseEntity> {
    const cnpjExists = await manager.existsBy(EnterpriseEntity, {
      cnpj: request.cnpj,
    });
    if (cnpjExists) {
      throw new ConflictException(
        `Error: A company with this CNPJ already exists !`,
      );
    }
    if (request.contactMail) {
      const contactMailExists = await manager.existsBy(EnterpriseEntity, {
        contactMail: request.contactMail,
      });
      if (contactMailExists) {
        throw new ConflictException(
          `Error: A company with this email address already exists!`,
        );
      }
    }

    const newEnterprise: EnterpriseEntity = manager.create(
      EnterpriseEntity,
      request,
    );
    const saved: EnterpriseEntity = await manager.save(newEnterprise);
    return saved;
  }

  public async findByCnpj(cnpj: string): Promise<EnterpriseEntity> {
    const enterprise = await this.enterpriseRepository.findOneBy({
      cnpj: cnpj,
    });

    if (!enterprise) {
      throw new NotFoundException('Error: No company was found with this CNPJ');
    }

    return enterprise;
  }
}
