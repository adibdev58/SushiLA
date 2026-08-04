import {type Express} from 'express';
import {roles} from "@sushila/shared"
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
      UserData : {
        email: string;
        forename: string;
        lastname: string;
        role: roles;
      }
    }
}