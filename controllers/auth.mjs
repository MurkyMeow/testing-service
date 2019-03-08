//import { Router } from 'express';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

import db from '../database';

const router = express.Router();
//const router = Router();

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const [user] = await db('Accounts').where({ email });
  if (!user) {
    const hash = bcrypt.hashSync(password, 8);
    await db('Accounts').insert({ email, password: hash, account_created: Date.now() });
    res.json({ status:"created account" });
  } else {
    res.status(400).json({ message: 'Fail to create account' });
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const [user] = await db('Accounts').where({ email });
  if (!user) {
    res.status(400).json({ message: 'Invalid login' });
  } else {
    if (bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user.id }, process.env.SECRET, {
        expiresIn: 86400
      });
      res.json({ token });
    } else {
      res.status(400).json({ message: 'Invalid password' });
  }}
});

export default router;
