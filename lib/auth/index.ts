import NextAuth from 'next-auth';
import { authConfig } from './config';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);

// Helper to get current session in server components
export { auth as getServerSession };

// Type extensions for NextAuth
declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
  }

  interface Session {
    user: User;
  }
}

// JWT type extension - using inline types instead of module augmentation
// since next-auth/jwt module resolution varies between versions
