import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get()
  check() {
    return { status: 'OK', timestamp: new Date().toISOString() };
  }
}
