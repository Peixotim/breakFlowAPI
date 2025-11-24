import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SquadRegister } from './DTOs/squads-register.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SquadEntity } from './entity/squads.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/types/payload-types';
import { UsersService } from 'src/users/users.service';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { UsersRoles } from 'src/users/entity/users.roles';
import { SquadsAdding } from './DTOs/squads-adding.dto';
import { UsersEntity } from 'src/users/entity/users.entity';
@Injectable()
export class SquadService {
  constructor(
    @InjectRepository(SquadEntity)
    private readonly squadRepository: Repository<SquadEntity>,
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async squadRegister(
    request: SquadRegister,
    sessionToken: string,
  ): Promise<SquadEntity> {
    if (!sessionToken) {
      throw new UnauthorizedException('Session token not found!');
    }
    if (!request) {
      throw new BadRequestException(
        'Error, the creation request came empty, correct this !',
      );
    }
    try {
      const payload = this.jwtService.verify<JwtPayload>(sessionToken);
      const user = await this.userService.findByMail(payload.email);
      const allowedRole = UsersRoles.OWNER;

      if (!user) {
        throw new UnauthorizedException('Error , user not found!');
      }

      if (user.role !== allowedRole) {
        throw new ForbiddenException(
          'Error : only owners have permission to create squads ',
        );
      }

      const newSquad = this.squadRepository.create({
        name: request.name,
        description: request.description,
        enterprise: user.enterprise,
      });

      const saved = await this.squadRepository.save(newSquad);
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

  public async findByUuid(uuid: string): Promise<SquadEntity> {
    if (!uuid) {
      throw new BadRequestException(
        'Error: The UUID is required for the search.',
      );
    }
    const squad = await this.squadRepository.findOne({
      where: { uuid: uuid },
      relations: ['enterprise', 'members'],
    });

    if (!squad) {
      throw new NotFoundException(`Error: Squad with UUID ${uuid} not found.`);
    }
    return squad;
  }

  public async addingToSquad(
    user: SquadsAdding,
    sessionToken: string,
    uuid: string,
  ) {
    if (!sessionToken) {
      throw new UnauthorizedException('Session token not found!');
    }
    if (!user) {
      throw new BadRequestException(
        'Error, the creation request came empty, correct this !',
      );
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(sessionToken);
      const userADM = await this.userService.findByMail(payload.email);
      const userAdd = await this.userService.findByMail(user.mail);
      const currentSquad = await this.findByUuid(uuid);
      const allowedRoles = [UsersRoles.OWNER, UsersRoles.MANAGER];

      if (!userADM) {
        throw new NotFoundException('Error, the user was not found!');
      }

      if (!userAdd) {
        throw new NotFoundException('Error, the user was not found!');
      }

      if (!allowedRoles.includes(userADM.role)) {
        throw new ForbiddenException(
          'Error, you do not have permission (Manager/Owner only) to create an event!',
        );
      }

      if (!currentSquad) {
        throw new NotFoundException(
          `Error: Squad with UUID ${uuid} not found.`,
        );
      }

      if (currentSquad.enterprise.uuid !== userADM.enterprise.uuid) {
        throw new ForbiddenException(
          'Error : the company you are trying to register a user is not the same one you belong to !',
        );
      }

      if (userADM.enterprise.uuid !== userAdd.enterprise.uuid) {
        throw new ForbiddenException(
          'Error, the company you are trying to register a user is not the same one you belong to !',
        );
      }

      userAdd.squad = currentSquad; // Usuario é adicionado ao squad
      const saved = await this.userRepository.save(userAdd);
      return saved;
    } catch (error) {
      if (
        error instanceof JsonWebTokenError ||
        error instanceof TokenExpiredError
      ) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Generic Error:', error);

      throw new BadRequestException('Error processing your request.');
    }
  }
}
