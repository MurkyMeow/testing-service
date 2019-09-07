import { graphql, GraphQLSchema } from 'graphql';
import { Server } from 'http';
import { Connection } from 'typeorm';
import { runServer, openDatabase, assert } from '../server';
import { getSchema } from '../modules';
import { User, Role } from '../entity/user';

let conn: Connection;
let server: Server;
let schema: GraphQLSchema;
let currentUser: User;

const _user = new User();
_user.email = 'hello@world';
_user.name = 'hello';
_user.password = 'world';
_user.role = Role.admin;

export const authenticate = async (user: User = _user) =>
  currentUser = await user.save();

export const signout = () =>
  currentUser = null;

beforeAll(async () => {
  schema = await getSchema();
  server = await runServer(4000, schema);
});
beforeEach(async () => {
  conn = await openDatabase(true);
});
afterEach(async () => {
  signout();
  await conn.close();
});
afterAll(() => {
  server.unref();
});

export const req = (query: string, variables?: any, user: User = currentUser) =>
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
    return res.data;
  });
