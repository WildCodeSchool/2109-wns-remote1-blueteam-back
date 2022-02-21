import 'reflect-metadata';
import * as tq from 'type-graphql';
import { ApolloServer } from 'apollo-server';
import { resolvers } from '../prisma/generated/type-graphql';
import { context } from './context';

import register from './custom-resolvers/register';
import users from './custom-resolvers/users';

const app = async () => {
  const schema = await tq.buildSchema({
    resolvers: [...resolvers, users, register],
    emitSchemaFile: true,
  });

  new ApolloServer({ schema, context: (req, res) => ({ prisma: context.prisma, req, res }) }).listen({ port: 4000 }, () =>
    console.log(
      `🚀 Server ready at: http://localhost:4000\n⭐️ See sample queries: http://pris.ly/e/ts/graphql-typegraphql-crud#using-the-graphql-api`
    )
  );
};

app();
