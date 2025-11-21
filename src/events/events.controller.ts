import {
  Body,
  Controller,
  Headers,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { EventsCreateDTO } from './DTOs/event-create.dto';
import { EventsService } from './events.service';
import { RolesGuard } from 'src/auth/guards/roles.guards';

@UseGuards(RolesGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}
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
}
