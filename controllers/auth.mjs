import { Router } from 'express';
import db from '../database';

const router = Router();

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const user = await db('Accounts').where({ email });
  if (!user) {
    await db('Accounts').insert({ email, password, account_created: Date.now() });
    res.redirect('/signin');
  }
});

router.post('/signin', (req, res) => {});

export default router;
