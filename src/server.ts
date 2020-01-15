import Next from 'next';
import { ApolloServer, ApolloError } from 'apollo-server-koa';
import { GraphQLSchema } from 'graphql';
import Koa from 'koa';
import { createConnection } from 'typeorm';
import http from 'http';
import cors from '@koa/cors';
import session from 'koa-session';
import bodyParser from 'koa-bodyparser';
import env from './env';
import { User } from './entity/user';

export type Context = {
  session: {
    user?: User;
  };
};

export function openDatabase(test: boolean) {
  return createConnection({
    type: 'sqlite',
    database: `./${test ? 'test' : 'db'}.sqlite`,
    dropSchema: test,
    synchronize: true,
    logging: false,
    entities: ['src/entity/**/*.ts'],
    migrations: ['src/migration/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
  });
}

export function assert<T>(val: T | undefined, code: string | number, msg?: string): T {
  if (!val) throw new ApolloError(msg || '', String(code));
  return val;
}

export async function runServer(port = 4000, schema: GraphQLSchema): Promise<http.Server> {
  const app = new Koa();

  app.keys = [env.secret];
  app.use(cors({ credentials: true }));
  app.use(bodyParser());
  app.use(session({ maxAge: 86400000 }, app));

  const server = new ApolloServer({
    schema,
    context: ({ ctx }) : Context => ({
      session: ctx.session,
    }),
  });
  server.applyMiddleware({ app });

  if (process.argv.includes('--frontend')) {
    const next = Next({ dev: true, dir: 'frontend' });
    const handle = next.getRequestHandler();
    app.use(ctx => handle(ctx.req, ctx.res));
  }

  return http
    .createServer(app.callback())
    .listen(port);
}
