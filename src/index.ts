import 'reflect-metadata';
import { getSchema } from './modules/index';
import { runServer, openDatabase } from './server';
import env from './env';

const { NODE_ENV = 'development' } = process.env;

async function start() {
  await openDatabase(false);
  const port = Number(process.env.PORT) || 4000;
  const schema = await getSchema();
  await runServer(port, schema);
  console.log(NODE_ENV === 'development'
    ? `ready on ${env.localhost}:${port}`
    : 'running'
  );
}
start();
