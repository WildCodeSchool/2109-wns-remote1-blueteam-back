import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { Arg, Ctx, Query, Resolver } from 'type-graphql';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import LoginInput from './input-validators/LoginInput';

import { User } from '../../prisma/generated/type-graphql';

@Resolver()
class LoginResolver {
  @Query(() => User)
  async login(
    @Ctx() ctx: { prisma: PrismaClient; res: Response },
    @Arg('data', () => LoginInput)
    { email, password }: LoginInput
  ): Promise<Partial<User>> {
    const user = await ctx.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { password: _, ...userToReturn } = user;

    const token = jwt.sign(
      userToReturn,
      process.env.JWTSECRET || 'MYSUPERSECRET',
      { expiresIn: '1h' }
    );
    console.log(token); // for developpement purpose only

    // token for web app
    ctx.res?.cookie('accessToken', token, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      secure: true,
    });
    // 1hour cookie validation
    // httpOnly readable only by server, avoid attacks and problems related to XSS
    // scure to authorize only on https

    // return the token for the mobile client
    return { token, ...userToReturn };
  }
}

export default LoginResolver;
