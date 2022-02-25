import { UseMiddleware } from "type-graphql";
import { ResolversEnhanceMap, User} from "../prisma/generated/type-graphql";
import checkToken from "./middlewares/checkToken";

export const mapped: ResolversEnhanceMap = {
    User: {
        _all: [UseMiddleware(checkToken)],
    },
  };