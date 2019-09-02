import { ApolloServer } from 'apollo-server-koa';
import Koa, { ParameterizedContext } from 'koa';
import { createConnection } from 'typeorm';
import Router from '@koa/router';
import cors from '@koa/cors';
import session from 'koa-session';
import bodyParser from 'koa-bodyparser';
import kstatic from 'koa-static';
import env from './env';
import { getSchema } from './modules/index';

export type Context = {
  ctx: ParameterizedContext;
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

export async function runServer(port = 4000): Promise<ApolloServer> {
  const app = new Koa();
  const router = Router();

  app.keys = [env.secret];
  app.use(cors({ credentials: true }));
  app.use(bodyParser(null));
  app.use(session({ maxAge: 86400000 }, app));
  app.use(kstatic(`${__dirname}/assets`));

  const schema = await getSchema();

  const server = new ApolloServer({
    schema,
    context: ({ ctx }) : Context => ({
      ctx,
    }),
  });
  server.applyMiddleware({ app });

  app.use(router.middleware());
  router.get('*', async ctx => {
    ctx.res.statusCode = 200;
  });
  app.use(async ctx => ctx.throw(404, 'Not found'));

  app.listen(port);
  return server;
}
