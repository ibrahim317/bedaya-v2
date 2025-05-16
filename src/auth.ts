import NextAuth from 'next-auth';
import type { DefaultSession, NextAuthOptions, User as NextAuthUser } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { userService } from '@/services/userService';
import type { Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { connectDB } from '@/lib/db';
import User from '@/models/main/User';

// Define the shape of our database User type
interface MongoUser extends Document {
  _id: { toString(): string };
  email: string;
  name?: string;
  role?: string;
  password: string;
  verified: boolean;
}

// Extend the session user type
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      verified: boolean;
    } & DefaultSession['user']
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password');
        }

        await connectDB();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error('Invalid email or password');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Invalid email or password');
        }

        if (user.verified === false) {
          throw new Error('UserNotVerified');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          verified: user.verified,
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT, user: NextAuthUser & { role?: string, verified?: boolean } }) {
      if (user) {
        token.role = user.role;
        token.verified = user.verified;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string;
        session.user.verified = token.verified as boolean;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions); 