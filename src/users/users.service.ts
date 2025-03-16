import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async getUserByEmail(email: string) {
    const result = await this.db.query(
      `SELECT id, email, password FROM users WHERE email = $1`,
      [email],
    );
    return result.rows[0] || null;
  }

  async createUser(
    email: string,
    password: string,
    first_name: string,
    last_name: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await this.db.query(
      `INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, created_at`,
      [email, hashedPassword, first_name, last_name],
    );
    return result.rows[0];
  }
}
