import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventsEntity } from './entity/events.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from 'src/types/payload-types';
import { EventsCreateDTO } from './DTOs/event-create.dto';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UsersRoles } from 'src/users/entity/users.roles';
import { EventsModifyDTO } from './DTOs/event-modify.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventsEntity)
    private readonly eventsRepository: Repository<EventsEntity>,
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async getAllEvents(session_token: string): Promise<EventsEntity[]> {
    if (!session_token) {
      throw new NotFoundException('Error , session token not found !');
    }
    try {
      const payload = this.jwtService.verify<JwtPayload>(session_token);
      const user = await this.usersService.findByMail(payload.mail);

      if (user == null) {
        throw new NotFoundException('Error , user not found !');
      }

      const events = await this.eventsRepository.find({
        where: { enterprise: { uuid: user.enterprise.uuid } },
        relations: ['users'],
      });

      return events;
    } catch (error) {
      if (
        error instanceof JsonWebTokenError ||
        error instanceof TokenExpiredError
      ) {
        throw new BadRequestException('Invalid or expired token');
      }
      throw error;
    }
  }

  public async eventsRegister(
    sessionToken: string,
    request: EventsCreateDTO,
  ): Promise<EventsEntity> {
    if (!sessionToken)
      throw new UnauthorizedException('Session token not found!');

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
        throw new ForbiddenException(
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
    } catch (error) {
      if (
        error instanceof JsonWebTokenError ||
        error instanceof TokenExpiredError
      ) {
        throw new BadRequestException('Invalid or expired token');
      }
      throw error;
    }
  }

  public async findByUuid(uuid: string): Promise<EventsEntity> {
    if (!uuid) {
      throw new NotFoundException('Error , uuid not found !');
    }

    const event = await this.eventsRepository.findOne({
      where: { uuid: uuid },
      relations: ['users', 'enterprise'],
    });

    if (!event) {
      throw new NotFoundException('Erro , event not found !');
    }

    return event;
  }
  public async eventsModify(
    uuid: string,
    session_token: string,
    request: EventsModifyDTO,
  ): Promise<EventsEntity> {
    if (!session_token) {
      throw new UnauthorizedException('Error , session token not found !');
    }

    if (!uuid) {
      throw new NotFoundException('Error , uuid not found !');
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(session_token);
      const user = await this.usersService.findByMail(payload.mail);
      const allowedRoles = [UsersRoles.OWNER, UsersRoles.MANAGER];

      if (!user) {
        throw new NotFoundException('Error , user not found !');
      }

      if (!allowedRoles.includes(user.role)) {
        throw new ForbiddenException(
          'Error, you do not have permission (Manager/Owner only) to create an event!',
        );
      }

      if (!uuid) {
        throw new BadRequestException(
          'Error: The UUID was not passed in the request. ',
        );
      }

      const event = await this.findByUuid(uuid);

      if (event.enterprise.uuid !== user.enterprise.uuid) {
        throw new ForbiddenException(
          'You cannot edit an event from another organization.',
        );
      }

      const eventsModify = this.eventsRepository.merge(event, {
        name: request.name,
        durationLimit: request.durationLimit,
        colorTheme: request.colorTheme,
        maxCapacity: request.maxCapacity,
      });

      const saved = await this.eventsRepository.save(eventsModify);
      return saved;
    } catch (error) {
      if (
        error instanceof JsonWebTokenError ||
        error instanceof TokenExpiredError
      ) {
        throw new BadRequestException('Invalid or expired token');
      }
      throw error;
    }
  }

  public async eventsDelete(uuid: string, sessionToken: string): Promise<void> {
    if (!sessionToken) {
      throw new UnauthorizedException('Error , session token not found !');
    }

    if (!uuid) {
      throw new ForbiddenException('Error , uuid not found !');
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(sessionToken);
      const user = await this.usersService.findByMail(payload.mail);
      const allowedRoles = [UsersRoles.MANAGER, UsersRoles.OWNER];

      if (!user) {
        throw new UnauthorizedException('Error , user not found!');
      }
      if (!allowedRoles.includes(user.role)) {
        throw new BadRequestException(
          'Error, you do not have permission (Manager/Owner only) to create an event!',
        );
      }

      const event = await this.findByUuid(uuid);
      if (!event) {
        throw new NotFoundException('Error , event not found !');
      }

      if (event.enterprise !== user.enterprise) {
        throw new ForbiddenException(
          'Error, the company you work for is not the same one from which you want to delete an event.',
        );
      }

      await this.eventsRepository.remove(event);
    } catch (error) {
      if (
        error instanceof JsonWebTokenError ||
        error instanceof TokenExpiredError
      ) {
        throw new BadRequestException('Invalid or expired token');
      }
      throw error;
    }
  }
}
