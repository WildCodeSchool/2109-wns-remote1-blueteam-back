import { UseMiddleware } from 'type-graphql';
import { ResolversEnhanceMap, User } from '../prisma/generated/type-graphql';
import checkToken from './middlewares/checkToken';
import refreshToken from './middlewares/refreshToken';

const mapped: ResolversEnhanceMap = {
  User: {
    _all: [UseMiddleware(checkToken), UseMiddleware(refreshToken)],
  },
};

export default mapped;
