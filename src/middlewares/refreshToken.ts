import jwt, { verify } from 'jsonwebtoken';
import { MiddlewareFn } from 'type-graphql';

import { Context as TContext } from '../context';

const refreshToken: MiddlewareFn<TContext> = ({ context }, next) => {
  try {
    const { authorization } = context.req.headers;
    const { accessToken } = context.req.cookies;

    if (!authorization && !accessToken) throw new Error('not authenticated');

    const token = authorization?.split(' ')[1] || accessToken;

    const payload = verify(token, process.env.JWTSECRET || 'MYSUPERSECRET');

    // check if token is expired and generate a new one
    if (typeof payload !== 'string' && payload.exp) {
      const isAlmostExpired =
        (payload.exp - Math.floor(Date.now() / 1000)) / 60 < 15;
      if (isAlmostExpired) {
        const { exp, iat, ...rest } = payload;
        const newToken = jwt.sign(
          rest,
          process.env.JWTSECRET || 'MYSUPERSECRET',
          { expiresIn: '1h' }
        );
        console.log('newToken', newToken);
        context.res.cookie('accessToken', newToken, {
          maxAge: 1000 * 60 * 60,
          httpOnly: true,
          secure: true,
        });
      }
    }

    return next();
  } catch (err) {
    throw new Error('not authenticated');
  }
};

export default refreshToken;
