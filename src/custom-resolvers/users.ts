import { prisma, PrismaClient } from "@prisma/client";
import { Arg, Ctx, ID, Query, Resolver } from "type-graphql";

import { User } from "../../prisma/generated/type-graphql";
  
// resolver get all users
@Resolver()
    class UsersResolvers {
        @Query(() => [User])
        async getAllUsers(
            @Ctx() ctx: { prisma: PrismaClient },
        ) {
            const allUsers = await ctx.prisma.user.findMany();
            return allUsers;
        }
        @Query(() => User)
        async getUserById(
            @Ctx() ctx: { prisma: PrismaClient },
            @Arg("id", () => ID) id: string
            ) {
            const user = await ctx.prisma.user.findUnique({ where: { id } });
            return user;
        }
    }

export default UsersResolvers;