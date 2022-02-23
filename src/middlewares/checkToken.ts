import { verify } from 'jsonwebtoken';
import { MiddlewareFn } from 'type-graphql';

import { Context as TContext } from '../context';

const checkToken: MiddlewareFn<TContext> = ({ context }, next) => {
  try {
    const authorization = context.req.headers.authorization;
    if (!authorization) throw new Error("not authenticated")
    console.log(authorization);
    const token = authorization.split(" ")[1];
    console.log(token);
    verify(token, process.env.JWTSECRET || "MYSUPERSECRET");

    return next()

  } catch (err) {
    throw new Error("not authenticated")
  }
}

export default checkToken;
