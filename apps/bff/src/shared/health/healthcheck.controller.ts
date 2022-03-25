import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller('health')
@ApiExcludeController()
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
