import { Module } from '@nestjs/common';
import { EnterpriseController } from './enterprise.controller';
import { EnterpriseService } from './enterprise.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnterpriseEntity } from './entity/enterprise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EnterpriseEntity])],
  controllers: [EnterpriseController],
  providers: [EnterpriseService],
  exports: [EnterpriseService],
})
export class EnterpriseModule {}
