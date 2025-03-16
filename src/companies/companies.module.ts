import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { DatabaseService } from '../database/database.service';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [CompaniesService, DatabaseService],
  controllers: [CompaniesController],
  exports: [CompaniesService],
})
export class CompaniesModule {}
