import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { DatabaseService } from '../database/database.service';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtAuthMiddleware } from 'src/auth/jwt-auth/jwt-auth.middleware';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [CompaniesService, DatabaseService],
  controllers: [CompaniesController],
  exports: [CompaniesService],
})
export class CompaniesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware) // Apply JWT authentication middleware
      .forRoutes({ path: 'companies', method: RequestMethod.ALL }); // Protect all /companies routes
  }
}
