import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { verifyToken } from '../utils/jwt.util';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    let token: string | undefined;

    // ------------------------
    //CHECK COOKIE FIRST
    // ------------------------
    if (request.cookies?.access_token) {
      token = request.cookies.access_token;
    }

    // ------------------------
    //FALLBACK TO HEADER
    // ------------------------
    if (!token) {
      const authHeader = request.headers['authorization'];

      if (authHeader) {
        const [bearer, headerToken] = authHeader.split(' ');

        if (bearer === 'Bearer' && headerToken) {
          token = headerToken;
        }
      }
    }

    // ------------------------
    // NO TOKEN FOUND
    // ------------------------
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    // ------------------------
    // VERIFY TOKEN
    // ------------------------
    try {
      const decoded = verifyToken(token);

      //  attach user to request
      (request as any).user = decoded;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}