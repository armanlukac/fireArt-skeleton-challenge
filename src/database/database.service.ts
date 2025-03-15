import { Injectable, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DatabaseService implements OnModuleInit {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
      ssl: { rejectUnauthorized: false }, // Necessary for Aiven
    });
  }

  async onModuleInit() {
    try {
      await this.pool.query('SELECT NOW()'); // Test connection
      console.log('Database connected');
    } catch (error) {
      console.error('Failed to connect to database, with error ->', error);
    }
  }

  async query(sql: string, params?: any[]) {
    return this.pool.query(sql, params);
  }

  async close() {
    await this.pool.end();
  }
}
