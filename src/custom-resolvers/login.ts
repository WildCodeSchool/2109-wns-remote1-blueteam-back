import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { Arg, Ctx, Query, Resolver } from "type-graphql";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

import { LoginInput } from "./register/LoginInput";

import { User } from "../../prisma/generated/type-graphql";
  
  @Resolver()
  class LoginResolver {
    @Query(() => User)
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

    // token for mobile app
    ctx.res.set("x-auth-token", token);

    // token for web app
    ctx.res.cookie("jwt", token);
   
      return userToReturn;
    }
  }

  export default LoginResolver;