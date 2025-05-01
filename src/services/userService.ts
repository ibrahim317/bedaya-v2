import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { IUser } from '@/types/User';
import { connectDB } from '@/lib/db';

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
   * Find all users
   */
  async findAll(): Promise<IUser[]> {
    await connectDB();
    const users = await User.find().select('-password').lean();
    return users as unknown as IUser[];
  },

  /**
   * Delete a user by ID
   */
  async deleteUser(userId: string): Promise<void> {
    await connectDB();
    await User.findByIdAndDelete(userId);
  },

  /**
   * Toggle user admin status
   */
  async toggleAdminStatus(userId: string, setAdmin: boolean): Promise<IUser | null> {
    await connectDB();
    
    const role = setAdmin ? 'admin' : 'user';
    console.log('[DEBUG] Attempting to update user:', userId, 'New role:', role);

    try {
      

      // Perform the update
      const updateResult = await User.updateOne(
        { _id: userId },
        { $set: { role } }
      );

      // Verify the update
      const updatedUser = await User.findById(userId).lean();

      if (!updatedUser) {
        throw new Error('User not found after update');
      }

      return updatedUser as unknown as IUser;
    } catch (error) {
      console.error('[ERROR] Failed to update user role:', error);
      throw error;
    }
  },

  /**
   * Find a user by email
   */
  async findByEmail(email: string): Promise<IUser | null> {
    await connectDB();
    const user = await User.findOne({ email }).lean();
    return user as IUser | null;
  },

  /**
   * Find a user by ID
   */
  async findById(id: string): Promise<IUser | null> {
    await connectDB();
    const user = await User.findById(id).select('email name role').lean();
    return user as IUser | null;
  },

  /**
   * Set user as admin
   */
  async setUserAsAdmin(email: string): Promise<IUser | null> {
    await connectDB();
    const user = await User.findOneAndUpdate(
      { email },
      { role: 'admin' },
      { new: true }
    ).lean();
    return user as IUser | null;
  },

  /**
   * Register a new user
   */
  async register(userData: RegisterUserData): Promise<IUser> {
    await connectDB();
    
    const { email, password, name } = userData;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email }).lean();
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
      role: 'user', // Set default role
      verified: false,
    });
    
    const savedUser = await newUser.save();
    return savedUser.toObject() as IUser;
  },

  /**
   * Verify user credentials for login
   */
  async verifyCredentials(credentials: LoginUserData): Promise<IUser | null> {
    await connectDB();
    
    const { email, password } = credentials;
    
    // Find the user by email and explicitly include password field
    const user = await User.findOne({ email }).select('+password').lean() as IUser | null;
    
    if (!user) {
      return null;
    }
    
    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    
    return user;
  },

  async verifyUser(userId: string): Promise<IUser | null> {
    await connectDB();
    const user = await User.findByIdAndUpdate(
      userId,
      { verified: true },
      { new: true }
    ).lean();
    if (!user) throw new Error('User not found');
    return user as unknown as IUser;
  },

  async verifyAllPendingUsers(): Promise<IUser[]> {
    await connectDB();
    const users = await User.updateMany(
      { verified: { $ne: true } },
      { verified: true }
    ).lean();
    return users as unknown as IUser[];
  }
};