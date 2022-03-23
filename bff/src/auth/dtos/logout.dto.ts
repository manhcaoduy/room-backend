import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponse {
  @ApiProperty({
    description: 'result',
  })
  result: boolean;

  constructor(partial: Partial<LogoutResponse>) {
    Object.assign(this, partial);
  }
}
