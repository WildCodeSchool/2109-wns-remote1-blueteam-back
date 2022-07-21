import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { Context } from "../context";
import { ChangePasswordInput } from "./input-validators/ChangePasswordInput";


@Resolver()
class ChangePasswordResolver {
  @Mutation(() => Boolean, { nullable: true })
  async changePassword(
    @Arg("data")
      { token, password }: ChangePasswordInput,
    @Ctx() ctx: Context
  ): Promise<Boolean | null> {

    const userId = jwt.verify(token, process.env.JWTSECRET || 'MYSUPERSECRET')

    if (!userId) {
      return null;
    }

    const user = await ctx.prisma.user.findUnique({ where : { id : Object.entries(userId)[0][1] as string } })

    if (!user) {
      return null;
    }

    user.password = await bcrypt.hash(password, 12);

    await ctx.prisma.user.update({
      where: {
        id : Object.entries(userId)[0][1] as string
      },
      data: {
        password : user.password
            }
    })

    return true;
  }
}
export default ChangePasswordResolver;

