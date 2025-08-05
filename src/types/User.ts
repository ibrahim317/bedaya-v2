// Define the interface for User data
export interface IUser {
  _id: string;
  email: string;
  password: string;
  name?: string;
  role: 'admin' | 'user';
  verified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}