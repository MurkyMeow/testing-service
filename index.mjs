import express from 'express';
import bodyParser from 'body-parser';

import auth from './controllers/auth';

const app = express();
app.use(bodyParser.json());
app.use('/auth', auth);

app.get('/', (request, response) => {
  response.send('Working');
});

app.listen(3000, () => console.log('server is running'));
