import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthCheckController {
  @Get('live')
  handleHealthCheckLive() {
    return 'OK';
  }

  @Get('readiness')
  handleHealthCheckReadiness() {
    return 'OK';
  }
}
