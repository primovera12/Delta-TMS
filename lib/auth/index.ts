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

declare module '@auth/core/jwt' {
  interface JWT {
    id: string;
    role: string;
  }
}
