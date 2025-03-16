import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async getUserByEmail(email: string) {
    const result = await this.db.query(
      `SELECT id, email, password, is_verified, status FROM users WHERE email = $1`,
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

  async verifyPassword(storedPassword: string, inputPassword: string) {
    return bcrypt.compare(inputPassword, storedPassword);
  }

  async verifyUser(token: string) {
    const result = await this.db.query(
      `UPDATE users SET is_verified = TRUE, status = 1, verification_token = NULL WHERE verification_token = $1 RETURNING id, email`,
      [token],
    );
    return result.rows[0];
  }

  async verifyUserManually(email: string) {
    const result = await this.db.query(
      `UPDATE users SET is_verified = TRUE, status = 1, verification_token = NULL WHERE email = $1 RETURNING id, email`,
      [email],
    );

    return result.rows[0] || null;
  }

  async blacklistToken(token: string, expiresAt: Date) {
    await this.db.query(
      `INSERT INTO blacklisted_tokens (token, expires_at) VALUES ($1, $2)`,
      [token, expiresAt],
    );
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const result = await this.db.query(
      `SELECT 1 FROM blacklisted_tokens WHERE token = $1 LIMIT 1`,
      [token],
    );
    return result.rowCount > 0;
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
    return result.rows[0];
  }

  // Password reset START
  async storeResetToken(userId: string, token: string, expiresAt: Date) {
    await this.db.query(
      `INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)`,
      [userId, token, expiresAt],
    );
  }

  async storeResetOtp(userId: string, otp: string, expiresAt: Date) {
    await this.db.query(
      `INSERT INTO password_resets (user_id, otp, expires_at) VALUES ($1, $2, $3)`,
      [userId, otp, expiresAt],
    );
  }

  async validateResetToken(token: string) {
    const result = await this.db.query(
      `SELECT user_id FROM password_resets WHERE token = $1 AND expires_at > NOW() AND used = FALSE LIMIT 1`,
      [token],
    );
    return result.rows[0] || null;
  }

  async validateResetOtp(otp: string) {
    const result = await this.db.query(
      `SELECT user_id FROM password_resets WHERE otp = $1 AND expires_at > NOW() AND used = FALSE LIMIT 1`,
      [otp],
    );
    return result.rows[0] || null;
  }

  async markResetUsed(userId: string) {
    await this.db.query(
      `UPDATE password_resets SET used = TRUE WHERE user_id = $1`,
      [userId],
    );
  }

  async updatePassword(userId: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.db.query(`UPDATE users SET password = $1 WHERE id = $2`, [
      hashedPassword,
      userId,
    ]);
  }

  async validateResetTokenOrOtp(token?: string, otp?: string) {
    let result: any;
    console.log('Called validateResetTokenOrOtp');
    console.log('token', token);
    console.log('otp', otp);

    if (token) {
      result = await this.db.query(
        `SELECT user_id FROM password_resets WHERE token = $1 AND expires_at > NOW() AND used = FALSE LIMIT 1`,
        [token],
      );
    } else if (otp) {
      result = await this.db.query(
        `SELECT user_id FROM password_resets WHERE otp = $1 AND expires_at > NOW() AND used = FALSE LIMIT 1`,
        [otp],
      );
    }

    return result?.rows[0]?.user_id || null;
  }
  // Password reset END
}
