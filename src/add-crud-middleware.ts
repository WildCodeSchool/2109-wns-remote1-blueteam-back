import { UseMiddleware } from 'type-graphql';
import {
  ResolversEnhanceMap,
  User,
  Team,
  Project,
  ProjectComment,
  ProjectFile,
  Task,
  TaskComment,
  TaskFile,
} from '../prisma/generated/type-graphql';
import checkToken from './middlewares/checkToken';
import refreshToken from './middlewares/refreshToken';

const mapped: ResolversEnhanceMap = {
  User: {
    _all: [UseMiddleware(checkToken), UseMiddleware(refreshToken)],
  },
  Team: {
    _all: [UseMiddleware(checkToken), UseMiddleware(refreshToken)],
  },
  Project: {
    _all: [UseMiddleware(checkToken), UseMiddleware(refreshToken)],
  },
  ProjectComment: {
    _all: [UseMiddleware(checkToken), UseMiddleware(refreshToken)],
  },
  ProjectFile: {
    _all: [UseMiddleware(checkToken), UseMiddleware(refreshToken)],
  },
  Task: {
    _all: [UseMiddleware(checkToken), UseMiddleware(refreshToken)],
  },
  TaskComment: {
    _all: [UseMiddleware(checkToken), UseMiddleware(refreshToken)],
  },
  TaskFile: {
    _all: [UseMiddleware(checkToken), UseMiddleware(refreshToken)],
  },
};

export default mapped;
