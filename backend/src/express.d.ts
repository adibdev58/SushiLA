import {type Express} from 'express';
import 'express-session';
import type { expectFailure } from 'node:test';

declare global {
  namespace Express {
    interface Request {
      isFromAdminEndpoint?: boolean; 
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    email?: string;
    forename?: string;
    lastname?: string;
    role?: 'admin' | 'user';
    }
}