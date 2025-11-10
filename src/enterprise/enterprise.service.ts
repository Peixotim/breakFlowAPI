import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnterpriseEntity } from './entity/enterprise.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EnterpriseService {
  constructor(
    @InjectRepository(EnterpriseEntity)
    private readonly enterpriseRepository: Repository<EnterpriseEntity>,
  ) {}

  public async createEnterprise(): Promise<EnterpriseEntity> {}
}
