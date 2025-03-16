import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  @Get('me')
  getProfile(@Req() req: Request) {
    return { user: req['user'] };
  }
}
