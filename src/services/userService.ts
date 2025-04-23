import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { IUser } from '@/types/User';
import { connectToDatabase } from '@/lib/db';

export interface RegisterUserData {
  email: string;
  password: string;
  name?: string;
}

export interface LoginUserData {
  email: string;
  password: string;
}

/**
 * User service for handling user-related operations
 */
export const userService = {
  /**
   * Find a user by email
   */
  async findByEmail(email: string): Promise<IUser | null> {
    await connectToDatabase();
    return User.findOne({ email }).exec();
  },

  /**
   * Find a user by ID
   */
  async findById(id: string): Promise<IUser | null> {
    await connectToDatabase();
    return User.findById(id).exec();
  },

  /**
   * Register a new user
   */
  async register(userData: RegisterUserData): Promise<IUser> {
    await connectToDatabase();
    
    const { email, password, name } = userData;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create and save the new user
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
    });
    
    return newUser.save();
  },

  /**
   * Verify user credentials for login
   */
  async verifyCredentials(credentials: LoginUserData): Promise<IUser | null> {
    await connectToDatabase();
    
    const { email, password } = credentials;
    
    // Find the user by email
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return null;
    }
    
    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    
    return user;
  }
}; 