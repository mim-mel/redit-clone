import { Router, Request, Response } from 'express';

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
};

const router = Router();
router.post('/register', register);

export default router;
