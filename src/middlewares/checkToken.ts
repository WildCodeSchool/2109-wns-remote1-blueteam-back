import { verify } from 'jsonwebtoken';
import { MiddlewareFn } from 'type-graphql';
import { User } from '../../prisma/generated/type-graphql';

import { Context as TContext } from '../context';

type JwtPayloadUser = {
  iat: number;
  exp: number;
} & Partial<User>;

const checkToken: MiddlewareFn<TContext> = ({ context }, next) => {
  try {
    // on veut vérifier si le JWT est présent
    //  * SOIT dans le header Authorization
    //  * SOIT dans le cookie accessToken
    const { authorization } = context.req.headers;
    const { accessToken } = context.req.cookies;

    if (!authorization && !accessToken) throw new Error('not authenticated');

    const token = authorization?.split(' ')[1] || accessToken;

    const { exp, iat, ...user } = verify(
      token,
      process.env.JWTSECRET || 'MYSUPERSECRET'
    ) as unknown as JwtPayloadUser;

    context.user = user;

    return next();
  } catch (err) {
    throw new Error('not authenticated');
  }
};

export default checkToken;
