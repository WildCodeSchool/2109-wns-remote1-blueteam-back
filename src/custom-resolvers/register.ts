import { PrismaClient } from "@prisma/client";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import bcrypt from "bcrypt";

import { User } from "../../prisma/generated/type-graphql";

import { RegisterInput } from "./register/RegisterInput";
  
  @Resolver()
    class RegisterResolver {
    @Mutation(() => User)
    async register(
      @Ctx() ctx: { prisma: PrismaClient },
      @Arg("data", () => RegisterInput)
      {
      email,
      firstname,
      lastname,
      password,
      job
    }: RegisterInput): Promise<User> {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await ctx.prisma.user.create({
        data: {
          firstname,
          lastname,
          email,
          password: hashedPassword,
          job,
          role: "NORMAL"
        }
      });
  
      return user;
    }
  }

  export default RegisterResolver;