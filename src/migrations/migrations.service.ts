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
                verification_token TEXT,
                status INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      `);

      await this.db.query(`
        CREATE TABLE IF NOT EXISTS blacklisted_tokens (
          id SERIAL PRIMARY KEY,
          token TEXT NOT NULL,
          expires_at TIMESTAMP NOT NULL
        );
      `);

      await this.db.query(`
        CREATE TABLE IF NOT EXISTS password_resets (
          id SERIAL PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          token TEXT,
          otp TEXT,
          expires_at TIMESTAMP NOT NULL,
          used BOOLEAN DEFAULT FALSE
        );
      `);

      // Random entity chosen for demonstration purposes (CRUD operations)
      await this.db.query(`
        CREATE TABLE IF NOT EXISTS companies (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL UNIQUE,
          contact VARCHAR(255) NOT NULL,
          city VARCHAR(100),
          country VARCHAR(100),
          website VARCHAR(255),
          status INTEGER DEFAULT 1,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);
    } catch (error) {
      console.error('Failed to run migrations, with error ->', error);
    }
  }
}
