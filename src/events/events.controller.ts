import {
  Body,
  Controller,
  Delete,
  Headers,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { EventsCreateDTO } from './DTOs/event-create.dto';
import { EventsService } from './events.service';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { EventsEntity } from './entity/events.entity';
import { EventsModifyDTO } from './DTOs/event-modify.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(RolesGuard)
  @Post('create-events')
  public async createEvent(
    @Headers('authorization') authHeader: string,
    @Body() request: EventsCreateDTO,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Token not found in request headers');
    }

    const sessionToken = authHeader.split(' ')[1];

    return this.eventsService.eventsRegister(sessionToken, request);
  }

  @Post('get-events')
  public async getEvents(
    @Headers('authorization') authHeader: string,
  ): Promise<EventsEntity[]> {
    if (!authHeader) {
      throw new UnauthorizedException('Token not found in request headers');
    }

    const sessionToken = authHeader.split(' ')[1];
    return this.eventsService.getAllEvents(sessionToken);
  }

  @UseGuards(RolesGuard)
  @Patch('event-modify')
  public async eventModify(
    @Headers('authorization') authHeader: string,
    @Body() uuid: string,
    request: EventsModifyDTO,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Token not found in request headers');
    }

    const sessionToken = authHeader.split(' ')[1];

    return this.eventsService.eventsModify(sessionToken, uuid, request);
  }

  @Delete('event-delete')
  public async eventDelete(
    @Headers('authorization') authHeader: string,
    @Body() uuid: string,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Token not found in request headers');
    }

    const sessionToken = authHeader.split(' ')[1];

    return this.eventsService.eventsDelete(sessionToken, uuid);
  }
}
