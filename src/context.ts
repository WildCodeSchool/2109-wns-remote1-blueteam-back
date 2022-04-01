import { PrismaClient, User } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  req: Request<any, Record<string, any>>;
  res: Response<any, Record<string, any>>;
  user?: Partial<User>;
}

export const context: Context = {
  prisma,
  req: {} as Request,
  res: {} as Response,
  user: undefined,
};
