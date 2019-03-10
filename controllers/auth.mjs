import express from 'express';
import 'express-async-errors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import db from '../database';
import env from '../env';
import { APIError, assert } from '../util/error';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const [user] = await db('Accounts').where({ email });
  assert(!user, new APIError(400, 'That email is busy'));
  const hash = bcrypt.hashSync(password, 8);
  await db('Accounts').insert({ email, password: hash, account_created: Date.now() });
  res.json({ status: 'Created account' });
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const [user] = await db('Accounts').where({ email });
  assert(user, new APIError(400, 'Invalid login'));
  assert(bcrypt.compareSync(password, user.password), new APIError(400, 'Invalid password'));
  const token = jwt.sign({ id: user.id }, env.secret, {
    expiresIn: 86400
  });
  res.json({ token });
});

export default router;
