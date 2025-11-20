import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventsEntity } from './entity/events.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventsEntity)
    private readonly userRepository: Repository<EventsEntity>,
  ) {}

  public async eventsRegister() {
    //Observação quando for criar o metodo de create , devo pegar
    //O access_token da pessoa para identificar a empresa que vai ser vinculada o evento
  }
}
