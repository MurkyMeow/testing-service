import { graphql, GraphQLSchema } from 'graphql';
import { Server } from 'http';
import { Connection } from 'typeorm';
import { runServer, openDatabase, assert } from '../server';
import { getSchema } from '../modules';
import { User, Role } from '../entity/user';

let conn: Connection;
let server: Server;
let schema: GraphQLSchema;

beforeAll(async () => {
  schema = await getSchema();
  server = await runServer(4000, schema);
});
beforeEach(async () => {
  conn = await openDatabase(true);
});
afterEach(async () => {
  await conn.close();
});
afterAll(() => {
  server.unref();
});

export const getUser = () => User.create({
  email: 'hello@world',
  name: 'hello',
  password: 'world',
  role: Role.admin,
}).save();

export const req = (query: string, variables?: any, user?: User) =>
  graphql({
    schema,
    source: query,
    variableValues: variables,
    contextValue: {
      assert,
      session: { user },
    },
  }).then(res => {
    if (res.errors) throw res.errors;
    return res;
  });
