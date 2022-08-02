import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { User } from '../../prisma/generated/type-graphql';
import { Context } from "../context";
import { ChangePasswordInput } from "./input-validators/ChangePasswordInput";
import UserWithToken from "../custom-types/userWithToken";

@Resolver()
class ChangePasswordResolver {
  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg("data")
      { token, password }: ChangePasswordInput,
    @Ctx() ctx: Context
  ): Promise<UserWithToken | null> {

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

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { password: _, ...userToReturn } = user;

    const tokenAfterResetPassword = jwt.sign(
      userToReturn,
      process.env.JWTSECRET || 'MYSUPERSECRET',
      { expiresIn: '1h' }
    );
    ctx.res?.cookie('accessToken', tokenAfterResetPassword, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      secure: true,
    });
    return { token, ...userToReturn };
  }
}
export default ChangePasswordResolver;

