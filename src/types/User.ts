// Define the interface for the User document
export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}