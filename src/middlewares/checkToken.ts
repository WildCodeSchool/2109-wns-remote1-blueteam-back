import { verify } from 'jsonwebtoken';
import { MiddlewareFn } from 'type-graphql';

import { Context as TContext } from '../context';

const checkToken: MiddlewareFn<TContext> = ({ context }, next) => {
  try {
    // on veut vérifier si le JWT est présent
    //  * SOIT dans le header Authorization
    //  * SOIT dans le cookie access_token
    const { authorization } = context.req.headers;
    const { access_token } = context.req.cookies;

    if (!authorization && !access_token) throw new Error("not authenticated")

    const token = authorization?.split(" ")[1] || access_token;
    
    verify(token, process.env.JWTSECRET || "MYSUPERSECRET");

    return next()
  } catch (err) {
    throw new Error("not authenticated")
  }
}

export default checkToken;
