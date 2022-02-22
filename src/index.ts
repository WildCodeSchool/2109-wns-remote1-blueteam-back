import 'reflect-metadata';
import * as tq from 'type-graphql';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { context } from './context';

import register from './custom-resolvers/register';
import users from './custom-resolvers/users';
import login from './custom-resolvers/login';

const app = async () => {
  // Initialize Express and HTTP server
  const app = express();
  app.use(cookieParser())
  app.use(cors());
  const httpServer = http.createServer(app);

  // Build GraphQL schema from TS entities and resolvers
  const schema = await tq.buildSchema({
    resolvers: [users, register, login],
    emitSchemaFile: true,
  });

  // Create Apollo server
  const server = new ApolloServer({
    schema,
    context: (req, res) => ({
      prisma: context.prisma,
      // cookies: req.cookies,
      req,
      res,
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  // Start Apollo server
  await server.start();
  
  // "Hook" Express app with Apollo server
  server.applyMiddleware({ app, cors: false });
  
  // Start HTTP server
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at: http://localhost:4000\n⭐️ See sample queries: http://pris.ly/e/ts/graphql-typegraphql-crud#using-the-graphql-api`);

};

app();
