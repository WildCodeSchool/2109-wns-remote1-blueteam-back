import { Resolver, Mutation, Ctx } from 'type-graphql';
import { Context } from '../context';

@Resolver()
class LogoutResolver {
  @Mutation(() => Boolean, { nullable: true })
  async logout(@Ctx() ctx: Context): Promise<void> {
    ctx.res.clearCookie('accessToken');
  }
}
export default LogoutResolver;
