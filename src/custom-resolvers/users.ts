import { PrismaClient } from '@prisma/client';
import { Arg, Ctx, ID, Query, Resolver, UseMiddleware } from 'type-graphql';

import { User } from '../../prisma/generated/type-graphql/models/User';

import checkToken from '../middlewares/checkToken';

// users resolvers
@Resolver()
class UsersResolvers {
  @Query(() => [User])
  @UseMiddleware(checkToken)
  async getAllUsers(@Ctx() ctx: { prisma: PrismaClient }) {
    const allUsers = await ctx.prisma.user.findMany();
    return allUsers;
  }

  @Query(() => User)
  @UseMiddleware(checkToken)
  async getUserById(
    @Ctx() ctx: { prisma: PrismaClient },
    @Arg('id', () => ID) id: string
  ) {
    const user = await ctx.prisma.user.findUnique({ where: { id } });
    return user;
  }
}

export default UsersResolvers;
