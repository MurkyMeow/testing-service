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
        if (samples) {
          ctx.body = await model.query().eager(eager).limit(samples);
        } else {
          const { where } = id ? standard.get : options.get;
          if (!where) ctx.throw('Couldnt find a `where` handler. Did you forget to specify id?', 400);
          ctx.body = await model.query()
            .where(where(ctx.request.query))
            .eager(eager);
        }
      });
      router.put(name, async ctx => {
        const { verify } = options.put || standard.put;
        const { eager = '', ...body } = ctx.request.body;
        ctx.assert(await verify(ctx.request.body), 409, 'This item already exists');
        ctx.body = await model.query().insert(body).eager(eager);
      });
      router.patch(name, async ctx => {
        ctx.body = await model.query().upsertGraph(ctx.request.body);
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
