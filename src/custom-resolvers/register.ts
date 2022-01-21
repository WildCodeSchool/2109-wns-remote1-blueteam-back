import { prisma } from "@prisma/client";
import { Arg, Mutation, Resolver } from "type-graphql";

import {
    User,
    UserWhereUniqueInput,
    UserKind,
  } from "../../prisma/generated/type-graphql";
  
  @Resolver()
  class RegisterResolver {
    @Mutation(() => User)
    changeUserKind(
      @Arg("where") where: UserWhereUniqueInput,
      @Arg("kind") kind: UserKind,
    ) {
      console.log("Changing user kind", { where, kind });
      return prisma.user.update({ where, data: { kind } });
    }
  }
  