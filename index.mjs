import express from 'express';
import bodyParser from 'body-parser';
import 'express-async-errors';

import auth from './controllers/auth';

const app = express();
app.use(bodyParser.json());

app.use('/auth', auth);

app.use((err, req, res) => {
  res.status(err.status).json({ message: err.message });
});

app.get('/', (request, response) => {
  response.send('Working');
});

// eslint-disable-next-line no-console
app.listen(3000, () => console.log('🚀 http://localhost:3000'));
