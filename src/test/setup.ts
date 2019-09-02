import axios from 'axios';
import { Server } from 'http';
import { Connection } from 'typeorm';
import { runServer, openDatabase } from '../server';

const host = 'http://localhost:4000/graphql';

let conn: Connection;
let server: Server;

beforeAll(async () => {
  server = await runServer();
});
beforeEach(async () => {
  conn = await openDatabase(true);
});
afterEach(async () => {
  await conn.close();
})
afterAll(async () => {
  await server.unref();
});

export async function req(query: string, variables: any) {
  const res = await axios.post(host, {
    query,
    variables,
  });
  return { ...res, data: res.data.data };
}
