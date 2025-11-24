import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entity/users.entity';
import { EventsEntity } from 'src/events/entity/events.entity';
import { SquadEntity } from 'src/squads/entity/squads.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity, EventsEntity]), SquadEntity],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
