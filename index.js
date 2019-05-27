const Koa = require('koa');
const cors = require('@koa/cors');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const { Model } = require('objection');
const knex = require('knex');
const env = require('./env');
const config = require('./knexfile');
const auth = require('./routes/auth');
const testing = require('./routes/testing');
const stats = require('./routes/stats');

Model.knex(knex(config.development));

const app = new Koa();
app.keys = [env.secret];
app.use(cors({ credentials: true }));
app.use(bodyParser());
app.use(session({ maxAge: 86400000 }, app));

app.use(auth.middleware());
app.use(testing.middleware());
app.use(stats.middleware());
app.use(async ctx => ctx.throw(404, 'Not found'));

app.listen(4000);
console.log('running on http://localhost:4000');
