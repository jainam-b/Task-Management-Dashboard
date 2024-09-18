// routes/users.ts
import express, { Request, Response, Router } from 'express';
import User from '../database/user'; // Your User model
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router: Router = express.Router();

// Register a new user
router.post('/register', async (req: Request, res: Response) => {
  const { name, email, password }: { name: string; email: string; password: string } = req.body;
  try {
    const hashedPassword: string = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Log in
router.post('/login', async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    console.error('Login error:', err);  // Log the error
    res.status(500).json({ error: (err as Error).message });
  }
});



export default router;
