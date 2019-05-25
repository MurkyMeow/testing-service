// "name,questions(id, text),id"
// -->
// ["name", "questions(id, text)", "id"]
function split([char, ...rest], acc = '', level = 0) {
  if (!char) return [acc];
  if (char === '(') return split(rest, `${acc}(`, level + 1);
  if (char === ')') return split(rest, `${acc})`, level - 1);
  if (char === ',' && level === 0) return [acc, ...split(rest, '', level)];
  return split(rest, `${acc}${char}`, level);
}

// half(aaa-bbb-ccc, '-')
// -->
// ['aaa', 'bbb-ccc']
function half(str, char) {
  const index = str.indexOf(char);
  if (index === -1) return [str, ''];
  return [
    str.slice(0, index),
    str.slice(index + 1)
  ];
}

function parse(ctx, [field, ...rest], builder) {
  if (!field.includes('(')) {
    const validator = builder.modelClass().schema[field];
    ctx.assert(validator, 400, `Field "${field}" is not present in the schema`);
    const { access } = validator;
    const allowed = access === 'any' || (access === 'creator' && ctx.meta.userIsCreator);
    ctx.assert(allowed, 403, `You are not allowed to get "${field}" field`);
    builder.select(field);
  } else {
    const [eager, eagerRest] = half(field, '(');
    const relations = Object.keys(builder.modelClass().getRelations());
    ctx.assert(relations.includes(eager), 400, `Unknown relation: ${eager}`);
    builder
      .mergeEager(eager)
      .modifyEager(eager, eagerBuilder => {
        eagerBuilder.select('id');
        const subfields = split(eagerRest.replace(/\)$/, ''));
        parse(ctx, subfields, eagerBuilder);
      });
  }
  if (rest.length) return parse(ctx, rest, builder);
  return builder;
}

function makeQuery(ctx, model, requestedFields) {
  ctx.assert(requestedFields, 400,
    'What fields should i give you? Please, specify the "include" param'
  );
  const fields = split(requestedFields);
  const builder = model.query().select('id');
  return parse(ctx, fields, builder);
}

module.exports = { makeQuery };
