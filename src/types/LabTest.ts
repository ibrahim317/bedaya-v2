import { Document } from 'mongoose';

export interface ILabTest extends Document {
  type: string;
  name: string;
} 