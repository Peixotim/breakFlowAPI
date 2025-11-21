import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventsEntity } from './entity/events.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from 'src/types/payload-types';
import { EventsCreateDTO } from './DTOs/event-create.dto';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UsersRoles } from 'src/users/entity/users.roles';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventsEntity)
    private readonly eventsRepository: Repository<EventsEntity>,
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async eventsRegister(
    sessionToken: string,
    request: EventsCreateDTO,
  ): Promise<EventsEntity> {
    if (!sessionToken) {
      throw new BadRequestException(
        'Error, you need to be in a session to create an event!',
      );
    }

    if (!request) {
      throw new BadRequestException(
        'Error, the creation request came empty, correct this !',
      );
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(sessionToken); //Recebe o sessionToken
      const user = await this.usersService.findByMail(payload.mail); //Retorna o usuario de acordo com o email vindo do sessionToken
      const allowedRoles = [UsersRoles.OWNER, UsersRoles.MANAGER];

      if (user === null) {
        throw new NotFoundException('Error, user not found!');
      }

      if (!allowedRoles.includes(user.role)) {
        throw new BadRequestException(
          'Error, you do not have permission (Manager/Owner only) to create an event!',
        );
      }

      const newEvent: EventsEntity = this.eventsRepository.create({
        name: request.name,
        colorTheme: request.colorTheme,
        durationLimit: request.durationLimit,
        maxCapacity: request.maxCapacity,
        enterprise: user.enterprise,
      });

      const saved = await this.eventsRepository.save(newEvent);

      return saved;
    } catch (err) {
      if (
        err instanceof JsonWebTokenError ||
        err instanceof TokenExpiredError
      ) {
        throw new BadRequestException('Invalid or expired token');
      }
      throw err;
    }
  }
}
