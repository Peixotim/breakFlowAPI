import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JwtPayload } from 'src/types/payload-types';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>(); //Recebe a requisição
    const authHeader = request.headers['authorization']; //Pega do header, a parte do authorization

    if (!authHeader) {
      throw new UnauthorizedException(
        'Error, no token was sent/received in the request header',
      );
    }

    const sessionToken = authHeader.replace('Bearer ', '').trim();

    try {
      const payload = this.jwtService.verify<JwtPayload>(sessionToken);
      const allowedRole = 'OWNER';

      if (payload.role !== allowedRole) {
        throw new ForbiddenException(
          'Error, you do not have permission (Owners only) to create an squad!',
        );
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      if (
        error instanceof JsonWebTokenError ||
        error instanceof TokenExpiredError
      ) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      throw new UnauthorizedException();
    }
  }
}
