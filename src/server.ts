import { Nuxt, Builder } from 'nuxt';
import { ApolloServer, ApolloError } from 'apollo-server-koa';
import { GraphQLSchema } from 'graphql';
import Koa from 'koa';
import { createConnection } from 'typeorm';
import http from 'http';
import cors from '@koa/cors';
import session from 'koa-session';
import bodyParser from 'koa-bodyparser';
import kstatic from 'koa-static';
import env from './env';
import config from '../nuxt.config';
import { User } from './entity/user';

export type Context = {
  session: {
    user: User;
  };
  assert<T>(cond: T | undefined, code: string | number, msg?: string): T;
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
  val: any,
  code: string | number,
  msg?: string
) {
  if (!val) throw new ApolloError(msg || '', code.toString());
  return val;
}

export async function runServer(port = 4000, schema: GraphQLSchema): Promise<http.Server> {
  const app = new Koa();

  app.keys = [env.secret];
  app.use(cors({ credentials: true }));
  app.use(bodyParser());
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

  if (process.argv.includes('--frontend')) {
    const nuxt = new Nuxt(config);
    const builder = new Builder(nuxt);
    await builder.build();

    app.use(async ctx => {
      ctx.status = 200;
      ctx.respond = false;
      nuxt.render(ctx.req, ctx.res);
    });
  }

  return http
    .createServer(app.callback())
    .listen(port);
}
