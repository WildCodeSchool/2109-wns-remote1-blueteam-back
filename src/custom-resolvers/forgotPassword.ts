import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import jwt from 'jsonwebtoken';
import { sendEmail } from "../mail-service/sendEmail";
import { Context } from "../context";
import ForgotPasswordInput from "./input-validators/ForgotPasswordInput";


@Resolver()
class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(
    @Ctx() ctx: Context,
    @Arg('data', () => ForgotPasswordInput)
      { email}: ForgotPasswordInput
  ): Promise<boolean> {
    const user = await ctx.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWTSECRET || 'MYSUPERSECRET',
      { expiresIn: '600s' }
    );

    await sendEmail(
      email,
      `http://localhost:8080/changepassword?token=${token}`
    );

    return true;
  }
}
export default ForgotPasswordResolver;