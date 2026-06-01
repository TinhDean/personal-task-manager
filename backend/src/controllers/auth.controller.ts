import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { JWT_SECRET } from '../middlewares/auth.middleware';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ message: 'Username is already taken' });
      return;
    }

    // Prepare User fields
    const userFields: any = {
      username,
    };

    // Only set email if it's a non-empty string, otherwise keep it undefined so 'sparse' index ignores it
    if (email && typeof email === 'string' && email.trim() !== '') {
      const emailLower = email.trim().toLowerCase();
      // Check if email already exists
      const existingEmail = await User.findOne({ email: emailLower });
      if (existingEmail) {
        res.status(400).json({ message: 'Email is already registered' });
        return;
      }
      userFields.email = emailLower;
    }

    userFields.passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User(userFields);

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Internal server error during registration' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      res.status(400).json({ message: 'Invalid username or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid username or password' });
      return;
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Internal server error during login' });
  }
};
