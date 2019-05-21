const Router = require('koa-joi-router');

const standard = {
  get: {
    authorize: () => true,
    where: query => ({ id: query.id }),
  },
  put: {
    verify: () => true,
  },
  patch: {
    authorize: async (ctx, model) => {
      const { id } = ctx.request.body;
      if (!id || ctx.session.user.role === 'admin') return true;
      const [item] = await model.query().where({ id });
      return item.creator_id === ctx.session.user.id;
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
        const authorize = (options.get && options.get.authorize) || standard.get.authorize;
        ctx.assert(await authorize(ctx, model), 403, 'Forbidden');

        const { id, samples, eager } = ctx.request.query;
        if (samples) {
          ctx.body = await model.query().limit(samples).eager(eager);
        } else {
          const { where } = id ? standard.get : options.get;
          if (!where) ctx.throw('Couldnt find a `where` handler. Did you forget to specify id?', 400);
          ctx.body = await model.query()
            .where(where(ctx.request.query))
            .eager(eager);
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
        const { authorize } = options.patch || standard.patch;
        ctx.assert(await authorize(ctx, model), 403, 'Forbidden');
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
