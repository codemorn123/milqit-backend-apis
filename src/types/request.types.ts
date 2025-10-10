import { Request } from 'express';

// export interface IRequest extends Request {
//   userId?: string;
//   token?: string;
// }

export interface IRequest extends Request {
  user?: {
    userId: string;
    roles: string[];
  };
}