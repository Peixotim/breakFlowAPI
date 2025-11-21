import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JwtPayload } from 'src/types/payload-types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>(); //Recebe a requisição
    const authHeader = request.headers['authorization']; //Pega do header, a parte do authorization

    if (!authHeader) {
      throw new BadRequestException(
        'Error, no token was sent/received in the request header',
      );
    }

    const sessionToken = authHeader.replace('Bearer ', '').trim();

    try {
      const payload = this.jwtService.verify<JwtPayload>(sessionToken);
      const allowedRoles = ['OWNER', 'MANAGER'];
      if (!allowedRoles.includes(payload.role)) {
        throw new BadRequestException(
          'Error, you do not have permission (Manager/Owner only) to create an event!',
        );
      }
      return true;
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
