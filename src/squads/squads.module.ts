import { Module } from '@nestjs/common';
import { SquadController } from './squads.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SquadEntity } from './entity/squads.entity';
import { SquadService } from './squads.service';
import { UsersModule } from 'src/users/users.module';
import { EnterpriseModule } from 'src/enterprise/enterprise.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SquadEntity]),
    UsersModule,
    EnterpriseModule,
  ],
  controllers: [SquadController],
  providers: [SquadService],
})
export class SquadModule {}
