import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsEntity } from './entity/events.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([EventsEntity]), UsersModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
