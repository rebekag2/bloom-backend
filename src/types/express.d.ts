// src/types/express.d.ts
import type { User as JwtUser } from 'path-to-your-user-type-or-interface';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtUser | any;
  }
}
