import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

// Login validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        // TODO: Implement actual database lookup with Prisma
        // For now, return a mock user for development
        // In production, this should:
        // 1. Query the database for the user
        // 2. Verify the password with bcrypt
        // 3. Return the user object or null

        // Mock user for development
        if (email === 'admin@delta.com' && password === 'password123') {
          return {
            id: '1',
            email: 'admin@delta.com',
            name: 'Admin User',
            role: 'ADMIN',
          };
        }

        if (email === 'dispatcher@delta.com' && password === 'password123') {
          return {
            id: '2',
            email: 'dispatcher@delta.com',
            name: 'Demo Dispatcher',
            role: 'DISPATCHER',
          };
        }

        if (email === 'driver@delta.com' && password === 'password123') {
          return {
            id: '3',
            email: 'driver@delta.com',
            name: 'Demo Driver',
            role: 'DRIVER',
          };
        }

        if (email === 'facility@delta.com' && password === 'password123') {
          return {
            id: '4',
            email: 'facility@delta.com',
            name: 'Demo Facility',
            role: 'FACILITY_STAFF',
          };
        }

        if (email === 'patient@delta.com' && password === 'password123') {
          return {
            id: '5',
            email: 'patient@delta.com',
            name: 'Demo Patient',
            role: 'PATIENT',
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard =
        nextUrl.pathname.startsWith('/dispatcher') ||
        nextUrl.pathname.startsWith('/driver') ||
        nextUrl.pathname.startsWith('/admin') ||
        nextUrl.pathname.startsWith('/facility') ||
        nextUrl.pathname.startsWith('/patient') ||
        nextUrl.pathname.startsWith('/family');

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      } else if (isLoggedIn) {
        // Redirect logged in users from login/register to their dashboard
        if (nextUrl.pathname === '/login' || nextUrl.pathname === '/register') {
          const role = auth.user?.role?.toLowerCase() || 'patient';
          const dashboardPaths: Record<string, string> = {
            admin: '/admin',
            super_admin: '/admin',
            operations_manager: '/dispatcher',
            dispatcher: '/dispatcher',
            driver: '/driver',
            facility_staff: '/facility',
            family_member: '/family',
            patient: '/patient',
          };
          const redirectPath = dashboardPaths[role] || '/patient';
          return Response.redirect(new URL(redirectPath, nextUrl));
        }
      }
      return true;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  trustHost: true,
};
