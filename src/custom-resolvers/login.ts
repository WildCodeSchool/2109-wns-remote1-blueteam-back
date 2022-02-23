import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { Arg, Ctx, Query, Resolver } from "type-graphql";

import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

import { LoginInput } from "./input-validators/LoginInput";

import { User } from "../../prisma/generated/type-graphql";
  
  @Resolver()
  class LoginResolver {
    @Query(() => User) // Omit password from User class
    async login(
      @Ctx() ctx: { prisma: PrismaClient, res: Response },
      @Arg("data", () => LoginInput)
      {
      email,
      password
    }: LoginInput): Promise<Partial<User>> {
      const user = await ctx.prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new Error("Invalid credentials");
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        throw new Error("Invalid credentials");
      }

      const { password: _, ...userToReturn} = user;

      const token = jwt.sign(
        userToReturn,
        process.env.JWTSECRET || "MYSUPERSECRET",
        { expiresIn: '1h' }
      );
      console.log(token);

      // token for mobile app
      // ctx.res.set("x-auth-token", token);

      // token for web app
      ctx.res?.cookie('access_token', token, { maxAge: 1000 * 60 * 60, httpOnly: true })
      // 1hour cookie validation & httpOnly readable only by server, avoid attacks and problems related to XSS
   
      return userToReturn;
    }
  }
  

  export default LoginResolver;
  