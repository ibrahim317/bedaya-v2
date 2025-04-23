import NextAuth from 'next-auth';
import type { DefaultSession, Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { userService } from '@/services/userService';
import type { Document } from 'mongoose';

// Define the shape of our database User type
interface MongoUser extends Document {
  _id: { toString(): string };
  email: string;
  name?: string;
}

// Extend the session user type
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user']
  }
}

const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const user = await userService.verifyCredentials({
          email: credentials.email,
          password: credentials.password,
        });

        if (!user) {
          throw new Error('Invalid email or password');
        }

        // Convert MongoDB document to NextAuth User
        const dbUser = user as unknown as MongoUser;
        return {
          id: dbUser._id.toString(),
          email: dbUser.email,
          name: dbUser.name || '',
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
    async jwt({ token, user }: { token: JWT; user: User | undefined }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
        },
      };
    },
  },
};

export default NextAuth(authConfig); 