import {
  Controller,
  Post,
  UseGuards,
  Headers,
  Body,
  UnauthorizedException,
  Param,
  Get,
} from '@nestjs/common';
import { OwnerGuard } from 'src/auth/guards/owner.guards';
import { SquadRegister } from './DTOs/squads-register.dto';
import { SquadService } from './squads.service';
import { SquadsAdding } from './DTOs/squads-adding.dto';
import { RolesGuard } from 'src/auth/guards/roles.guards';

@Controller('squad')
export class SquadController {
  constructor(private readonly squadService: SquadService) {}

  @UseGuards(OwnerGuard)
  @Post('register-squad')
  public async registerSquad(
    @Headers('authorization') authHeader: string,
    @Body() request: SquadRegister,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Token not found in request headers');
    }

    const sessionToken = authHeader.split(' ')[1];

    return this.squadService.squadRegister(request, sessionToken);
  }

  @Get(':uuid')
  public async findByUuid(@Param('uuid') uuid: string) {
    return this.squadService.findByUuid(uuid);
  }

  @UseGuards(RolesGuard)
  @Post('adding-to-squad/:uuid')
  public async addingToSquad(
    @Param('uuid') uuid: string,
    @Headers('authorization') authHeader: string,
    @Body() request: SquadsAdding,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Token not found in request headers');
    }

    const sessionToken = authHeader.split(' ')[1];

    return await this.squadService.addingToSquad(request, sessionToken, uuid);
  }

  @Get('all-squads')
  public async getAllSquads() {}
}
