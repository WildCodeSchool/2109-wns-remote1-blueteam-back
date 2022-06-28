import { PrismaClient } from '@prisma/client';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import bcrypt from 'bcrypt';

import { User } from '../../prisma/generated/type-graphql';

import RegisterInput from './input-validators/RegisterInput';
import { Context } from "../context";

@Resolver()
class RegisterResolver {
  @Mutation(() => User)
  async register(
    @Ctx() ctx: Context,
    @Arg('data', () => RegisterInput)
    { email, firstname, lastname, password, job }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await ctx.prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword,
        job,
        role: 'USER',
      },
    });

    return user;
  }
}

export default RegisterResolver;
