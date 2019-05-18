const Router = require('koa-joi-router');

const standard = {
  get: {
    where: query => ({ id: query.id })
  },
  put: {
    verify: () => true,
  }
};

module.exports.Rest = prefix => {
  const router = Router();
  router.prefix(prefix);
  return {
    router,
    register: (name, model, options = {}) => {
      router.get(name, async ctx => {
        const { id, samples, eager } = ctx.request.query;
        const { where } = id ? standard.get : options.get;
        if (samples) {
          ctx.body = await model.query().eager(eager).limit(samples);
        } else {
          if (!where) ctx.throw('Couldnt find a `where` handler. Did you forget to specify id?', 400);
          const [item] = await model.query()
            .where(where(ctx.request.query))
            .eager(eager);
          ctx.body = item;
        }
      });
      router.put(name, async ctx => {
        const { verify } = options.put || standard.put;
        const { eager = '', ...body } = ctx.request.body;
        ctx.assert(await verify(ctx.request.body), 409, 'This item already exists');
        ctx.body = await model.query().insert(body).eager(eager);
      });
      router.post(name, async ctx => {
        const { id, ...patch } = ctx.request.body;
        ctx.body = await model.query().findById(id).patch(patch);
      });
      router.delete(name, async ctx => {
        const { id } = ctx.request.query;
        ctx.body = await model.query().deleteById(id);
      });
    }
  };
};
