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

  async saveVerificationToken(userId: string, token: string) {
    const result = await this.db.query(
      `UPDATE users SET status = 0, verification_token = $1 WHERE id = $2 RETURNING id, email, verification_token`,
      [token, userId],
    );
    console.log(result.rows[0]);
    return result.rows[0];
  }

  async verifyUser(token: string) {
    const result = await this.db.query(
      `UPDATE users SET is_verified = TRUE, status = 1, verification_token = NULL WHERE verification_token = $1 RETURNING id, email`,
      [token],
    );
    return result.rows[0];
  }

  async createUser(
    email: string,
    password: string,
    first_name: string,
    last_name: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await this.db.query(
      `INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, created_at`,
      [email, hashedPassword, first_name, last_name],
    );
    console.log('User created:', result.rows[0]);
    return result.rows[0];
  }
}
