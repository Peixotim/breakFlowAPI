import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsEntity } from './entity/events.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventsEntity])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
