import { Module } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { HealthController } from './health/health.controller';
import { HealthModule } from './health/health.module';
import { MigrationsModule } from './migrations/migrations.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    DatabaseModule,
    HealthModule,
    MigrationsModule,
    AuthModule,
    UsersModule,
    EmailModule,
  ],
  controllers: [HealthController],
  providers: [DatabaseService],
})
export class AppModule {
  constructor(private readonly databaseService: DatabaseService) {}
}
