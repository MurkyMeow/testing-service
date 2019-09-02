import 'reflect-metadata';
import { runServer, openDatabase } from './server';
import env from './env';

const { NODE_ENV = 'development' } = process.env;

(async function() {
  await openDatabase(false);
  const port = Number(process.env.PORT) || 4000;
  runServer(port);
  console.log(NODE_ENV === 'development'
    ? `ready on ${env.localhost}:${port}`
    : 'running'
  );
}())
