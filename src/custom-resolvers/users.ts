import { PrismaClient } from '@prisma/client';
import { Arg, Ctx, Query, Resolver, UseMiddleware } from 'type-graphql';

import { User } from '../../prisma/generated/type-graphql/models/User';
import checkToken from '../middlewares/checkToken';

// users resolvers
@Resolver()
class UsersResolvers {
  @Query(() => User)
  @UseMiddleware(checkToken)
  async getConnectedUser(
    @Ctx() ctx: { prisma: PrismaClient; user: Partial<User> }
  ): Promise<User | null> {
    const activeUser = await ctx.prisma.user.findUnique({
      where: { id: ctx.user.id },
    });
    return activeUser;
  }

  // Need to be protected by ADMIN role only
  @Query(() => [User])
  @UseMiddleware(checkToken)
  async getAllUsers(@Ctx() ctx: { prisma: PrismaClient }) {
    const allUsers = await ctx.prisma.user.findMany();
    return allUsers;
  }
}

export default UsersResolvers;
