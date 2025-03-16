import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1]; // Extract the token
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      req['user'] = decoded; // Attach decoded user data to the request
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
