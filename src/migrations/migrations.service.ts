import { Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class MigrationsService implements OnModuleInit {
  constructor(private readonly db: DatabaseService) {}

  async onModuleInit() {
    await this.runMigrations();
  }

  async runMigrations() {
    console.log('Running database migrations.');

    try {
      await this.db.query(`
                CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email VARCHAR(255) UNIQUE NOT NULL,
                first_name VARCHAR(255) NOT NULL,
                last_name VARCHAR(255) NOT NULL,
                password TEXT NOT NULL,
                is_verified BOOLEAN DEFAULT FALSE,
                status BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      `);
    } catch (error) {
      console.error('Failed to run migrations, with error ->', error);
    }
  }
}
