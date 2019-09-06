import { ApolloServer, ApolloError } from 'apollo-server-koa';
import { GraphQLSchema } from 'graphql';
import Koa from 'koa';
import { createConnection } from 'typeorm';
import http from 'http';
import Router from '@koa/router';
import cors from '@koa/cors';
import session from 'koa-session';
import bodyParser from 'koa-bodyparser';
import kstatic from 'koa-static';
import env from './env';
import { User } from './entity/user';

export type Context = {
  session: {
    user: User;
  };
  assert(cond: boolean, code: string | number, msg?: string): void;
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

export function assert(
  cond: boolean,
  code: string | number,
  msg?: string
) {
  if (!cond) throw new ApolloError(msg || '', code.toString());
}

export async function runServer(port = 4000, schema: GraphQLSchema): Promise<http.Server> {
  const app = new Koa();
  const router = Router();

  app.keys = [env.secret];
  app.use(cors({ credentials: true }));
  app.use(bodyParser(null));
  app.use(session({ maxAge: 86400000 }, app));
  app.use(kstatic(`${__dirname}/assets`));

  const server = new ApolloServer({
    schema,
    context: ({ ctx }) : Context => ({
      session: ctx.session,
      assert,
    }),
  });
  server.applyMiddleware({ app });

  app.use(router.middleware());
  router.get('*', async ctx => {
    ctx.res.statusCode = 200;
  });
  app.use(async ctx => ctx.throw(404, 'Not found'));
  return http
    .createServer(app.callback())
    .listen(port);
}
