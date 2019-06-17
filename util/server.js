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
  ctx.assert(user && (!role || user.role === 'admin' || user.role === role), 403);
  await next();
};

const Rest = prefix => {
  const router = Router();
  router.prefix(prefix);
  return {
    router,
    register: (name, model, options = {}) => {
      async function handleGet(ctx) {
        const { id, samples, include } = ctx.request.query;
        ctx.meta = { userIsCreator: id && await isCreator(ctx, model) };
        const query = makeQuery(ctx, model, include);
        if (samples) {
          ctx.body = await query.limit(samples);
        } else {
          const { where } = id ? standard.get : options.get;
          ctx.assert(where, 400, 'Couldnt find a `where` handler. Did you forget to specify id?');
          ctx.body = await query.where(where(ctx.request.query));
        }
      }

      async function handlePut(ctx) {
        const { verify } = options.put || standard.put;
        const { include, ...body } = ctx.request.body;
        ctx.assert(await verify(ctx), 409, 'This item already exists');
        ctx.body = await makeQuery(ctx, model, include).insert({
          ...body,
          creator_id: ctx.session.user.id,
        });
      }

      async function handlePatch(ctx) {
        const { body } = ctx.request;
        ctx.assert(await isCreator(ctx, model), 403, 'Forbidden');
        const verify = (options.patch && options.patch.verify) || standard.patch.verify;
        await verify(ctx, model);
        const patch = body.id
          ? body
          : { ...body, creator_id: ctx.session.user.id };
        ctx.body = await model.query().upsertGraph(patch);
      }

      async function handlePost(ctx) {
        const { id, ...patch } = ctx.request.body;
        ctx.body = await model.query().findById(id).patch(patch);
      }

      async function handleDelete(ctx) {
        const { id } = ctx.request.query;
        const { role } = ctx.session.user;
        const [item] = await model.query().where({ id });
        ctx.assert(role === 'admin' || ctx.session.user.id === item.creator_id, 403);
        await model.query().deleteById(id);
        ctx.body = { ok: true };
      }

      router.get(name, handleGet);
      router.use(guard('teacher'));
      router.put(name, handlePut);
      router.post(name, handlePost);
      router.patch(name, handlePatch);
      router.delete(name, handleDelete);
    }
  };
};

module.exports = {
  guard,
  Rest,
};
