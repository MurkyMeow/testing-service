import express from 'express';
import bodyParser from 'body-parser';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(bodyParser.json());

app.get('/', (request, response) => {
  response.send('hello');
});

app.listen(3000, () => console.log('server is running'));
