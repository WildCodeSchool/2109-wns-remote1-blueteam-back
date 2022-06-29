import { Resolver, Mutation, Ctx } from 'type-graphql';
import { Context } from '../context';

@Resolver()
class LogoutResolver {
  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: Context): Promise<boolean> {
    ctx.res.clearCookie('accessToken');
    return true;
  }
}
export default LogoutResolver;
