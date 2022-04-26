import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { HealthCheckModule } from '../src/healthcheck/healthcheck.module';

describe('EmasterController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, HealthCheckModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/health/live return OK', () => {
    return request(app.getHttpServer())
      .get('/health/live')
      .expect(200)
      .expect('OK');
  });
});
