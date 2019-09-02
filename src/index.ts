import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server-koa';
import Koa, { ParameterizedContext } from 'koa';
import cors from '@koa/cors';
import Router from '@koa/router';
import session from 'koa-session';
import bodyParser from 'koa-bodyparser';
import kstatic from 'koa-static';
import { modules } from './modules/index';
import env from './env';

const { NODE_ENV = 'development' } = process.env;

export type Context = {
  ctx: ParameterizedContext;
};

createConnection().then(() => {
  const app = new Koa();
  const router = Router();

  app.keys = [env.secret];
  app.use(cors({ credentials: true }));
  app.use(bodyParser(null));
  app.use(session({ maxAge: 86400000 }, app));
  app.use(kstatic(`${__dirname}/assets`));

  const server = new ApolloServer({
    modules,
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

  const port = process.env.PORT || 4000;
  app.listen(port);
  console.log(NODE_ENV === 'development'
    ? `ready on ${env.localhost}:${port}`
    : 'running'
  );
});