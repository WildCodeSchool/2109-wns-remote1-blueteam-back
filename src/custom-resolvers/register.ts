import { PrismaClient } from "@prisma/client";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";

import {
    User,
    UserWhereUniqueInput,
    UserRole,
  } from "../../prisma/generated/type-graphql";
  
  @Resolver()
  class RegisterResolver {
    @Mutation(() => User)
    changeUserKind(
      @Ctx() ctx: { prisma: PrismaClient },
      @Arg("where") where: UserWhereUniqueInput,
      @Arg("role") role: UserRole,
    ) {
      console.log("Changing user role", { where, role });
      return ctx.prisma.user.update({ where, data: { role } });
    }
  }
  