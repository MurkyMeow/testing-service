const Router = require('koa-joi-router');
const { makeQuery } = require('./parser');

const isCreator = async (ctx, model) => {
  const { id } = ctx.method === 'GET' || ctx.method === 'DELETE'
    ? ctx.request.query
    : ctx.request.body;
  if (!id || ctx.session.user.role === 'admin') return true;
  const item = await model.query().findById(id);
  return ctx.session.user.id === item.creator_id;
};

const standard = {
  get: {
    where: query => ({ id: query.id }),
  },
  put: {
    verify: () => true,
  },
  patch: {
    verify: async ctx => {
      ctx.throw(403, 'Forbidden');
    },
  },
};

const guard = role => async (ctx, next) => {
  const { user } = ctx.session;
  if (!user || (role && user.role !== role)) {
    ctx.throw(403, 'Forbidden');
  }
  await next();
};

const Rest = prefix => {
  const router = Router();
  router.prefix(prefix);
  return {
    router,
    register: (name, model, options = {}) => {
      router.get(name, async ctx => {
        const { id, samples, include } = ctx.request.query;
        ctx.assert(include, 400,
          'What fields should i give you? Please, specify the "include" param'
        );
        ctx.meta = { userIsCreator: id && await isCreator(ctx, model) };
        const query = makeQuery(ctx, model, include);
        if (samples) {
          ctx.body = await query.limit(samples);
        } else {
          const { where } = id ? standard.get : options.get;
          if (!where) ctx.throw('Couldnt find a `where` handler. Did you forget to specify id?', 400);
          ctx.body = await query.where(where(ctx.request.query));
        }
      });
      router.use(guard());
      router.put(name, async ctx => {
        const { verify } = options.put || standard.put;
        const { eager = '', ...body } = ctx.request.body;
        ctx.assert(await verify(ctx.request.body), 409, 'This item already exists');
        ctx.body = await model.query().insert(body).eager(eager);
      });
      router.patch(name, async ctx => {
        const { body } = ctx.request;
        ctx.assert(await isCreator(ctx, model), 403, 'Forbidden');
        const verify = (options.patch && options.patch.verify) || standard.patch.verify;
        if (verify) await verify(ctx, model);
        const patch = body.id
          ? body
          : { ...body, creator_id: ctx.session.user.id };
        ctx.body = await model.query().upsertGraph(patch);
      });
      router.post(name, async ctx => {
        const { id, ...patch } = ctx.request.body;
        ctx.body = await model.query().findById(id).patch(patch);
      });
      router.delete(name, async ctx => {
        const { id } = ctx.request.query;
        const { role } = ctx.session.user;
        const [item] = await model.query().where({ id });
        if (role === 'admin' || ctx.session.user.id === item.creator_id) {
          await model.query().deleteById(id);
          ctx.body = { ok: true };
        } else {
          ctx.throw(403, 'forbidden');
        }
      });
    }
  };
};

module.exports = {
  guard,
  Rest,
};
