import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DatabaseService } from './database/database.service';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get the database service and run the connection test manually
  const databaseService = app.get(DatabaseService);
  await databaseService.onModuleInit();

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server running on port ${process.env.PORT}`);
}
bootstrap();
