import { Request } from 'express';

export interface RequestWithUser extends Request {
  user?: {
    sub: string; // User ID
    email: string;
    iat: number; // Issued at
    exp: number; // Expiration time
  };
}
