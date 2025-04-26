import { ConsoleSqlOutlined } from '@ant-design/icons';
import { fetchJson } from './base';
import { IUser } from '@/types/User';

export interface FormattedUser {
  key: string;
  name: string;
  email: string;
  role: string;
  verified: boolean;
  createdAt: string;
}

export const usersClient = {
  /**
   * Get all users
   */
  async getAllUsers(): Promise<FormattedUser[]> {
    const response = await fetch('/api/users');
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const users: IUser[] = await response.json();
    return users.map(user => ({
      key: user._id,
      name: user.name || 'N/A',
      email: user.email,
      role: user.role,
      verified: user.verified,
      createdAt: new Date(user.createdAt).toLocaleDateString(),
    }));
  },

  /**
   * Find a user by email
   */
  async findByEmail(email: string): Promise<IUser | null> {
    const response = await fetch(`/api/users/email/${email}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    const user: IUser = await response.json();
    return user;
  },

  /**
   * Delete a user
   */
  async deleteUser(userId: string): Promise<void> {
    await fetchJson('/api/users', {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    });
  },

  /**
   * Toggle user's admin status
   */
  async toggleAdminStatus(userId: string, setAdmin: boolean): Promise<IUser> {
    return await fetchJson<IUser>('/api/users/toggle-admin', {
      method: 'POST',
      body: JSON.stringify({ userId, setAdmin }),
    });
  },

  /**
   * Register a new user
   */
  async registerUser(data: { email: string; password: string; name?: string }): Promise<IUser> {
    return await fetchJson<IUser>('/api/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Verify a single user
   */
  async verifyUser(userId: string): Promise<FormattedUser> {
    const response = await fetch(`/api/users/verify/${userId}`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error('Failed to verify user');
    }
    const user: IUser = await response.json();
    return {
      key: user._id,
      name: user.name || 'N/A',
      email: user.email,
      role: user.role,
      verified: user.verified,
      createdAt: new Date(user.createdAt).toLocaleDateString(),
    };
  },


  /**
   * Verify all pending users
   */
  async verifyAllPendingUsers(): Promise<{ message: string; users: FormattedUser[] }> {
    const response = await fetch('/api/users/verify-all', {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error('Failed to verify all users');
    }
    const result = await response.json();
    return {
      message: result.message,
      users: result.users.map((user: IUser) => ({
        key: user._id,
        name: user.name || 'N/A',
        email: user.email,
        role: user.role,
        verified: user.verified,
        createdAt: new Date(user.createdAt).toLocaleDateString(),
      })),
    };
  },
}; 