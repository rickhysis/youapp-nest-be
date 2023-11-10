import {
  INestApplication,
  ModuleMetadata,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigModule } from '@nestjs/config';
import { DataBaseModule } from '../../../providers/database/mongo/provider.module';

export const createBaseTestingModule = (metadata: ModuleMetadata) => {
  return Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env.test',
      }),
      //mongooseTestModule(),
      DataBaseModule,
      ...(metadata.imports || [])
    ],
    providers: [...(metadata.providers || [])],
    exports: [...(metadata.exports || [])],
    controllers: [...(metadata.controllers || [])],
  });
};

export const createBaseNestApplication = async (
  moduleFixture: TestingModule,
) => {
  const app = await moduleFixture.createNestApplication({
    bufferLogs: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  return app;
};

export const closeAllConnections = async ({
  module,
}: {
  module?: TestingModule | INestApplication;
}) => {
  //await closeMongoServerConnection();
  await module?.close();
};