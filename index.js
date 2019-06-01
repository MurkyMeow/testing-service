const Koa = require('koa');
const Next = require('next');
const cors = require('@koa/cors');
const session = require('koa-session');
const router = require('koa-joi-router');
const bodyParser = require('koa-bodyparser');
const { Model } = require('objection');
const knex = require('knex');
const env = require('./env');
const config = require('./knexfile');
const auth = require('./routes/auth');
const testing = require('./routes/testing');
const stats = require('./routes/stats');

const { NODE_ENV = 'development' } = process.env;

Model.knex(knex(config[NODE_ENV]));

const next = Next({
  dir: 'frontend-js',
  dev: NODE_ENV === 'development',
});

next.prepare().then(() => {
  const app = new Koa();
  const routes = router();
  const handle = next.getRequestHandler();

  app.keys = [env.secret];
  app.use(cors({ credentials: true }));
  app.use(bodyParser());
  app.use(session({ maxAge: 86400000 }, app));

  app.use(auth.middleware());
  app.use(testing.middleware());
  app.use(stats.middleware());

  routes.get('*', async ctx => {
    await handle(ctx.req, ctx.res);
    ctx.res.statusCode = 200;
  });

  app.use(routes.middleware());
  app.use(async ctx => ctx.throw(404, 'Not found'));

  const port = process.env.PORT || 4000;
  app.listen(port);
  console.log('ready on port', port);
});
