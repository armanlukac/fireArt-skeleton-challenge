import { Module } from '@nestjs/common';
import { MigrationsService } from './migrations.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [MigrationsService],
})
export class MigrationsModule {}
