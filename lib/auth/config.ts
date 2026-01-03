import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { UserStatus } from '@prisma/client';

// Login validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Maximum failed login attempts before lockout
const MAX_FAILED_ATTEMPTS = 5;
// Lockout duration in minutes
const LOCKOUT_DURATION_MINUTES = 15;

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

        try {
          // Query the database for the user
          const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              passwordHash: true,
              role: true,
              status: true,
              failedLoginAttempts: true,
              lockedUntil: true,
            },
          });

          // User not found
          if (!user) {
            return null;
          }

          // Check if account is locked
          if (user.lockedUntil && new Date() < user.lockedUntil) {
            console.log(`Account locked for ${user.email} until ${user.lockedUntil}`);
            return null;
          }

          // Check if account is active
          if (user.status === UserStatus.SUSPENDED || user.status === UserStatus.INACTIVE) {
            console.log(`Account suspended/inactive for ${user.email}`);
            return null;
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(password, user.passwordHash);

          if (!isValidPassword) {
            // Increment failed login attempts
            const newFailedAttempts = user.failedLoginAttempts + 1;
            const updateData: { failedLoginAttempts: number; lockedUntil?: Date } = {
              failedLoginAttempts: newFailedAttempts,
            };

            // Lock account if max attempts exceeded
            if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
              updateData.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
              console.log(`Account locked for ${user.email} due to too many failed attempts`);
            }

            await prisma.user.update({
              where: { id: user.id },
              data: updateData,
            });

            return null;
          }

          // Successful login - reset failed attempts and update last login
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: 0,
              lockedUntil: null,
              lastLoginAt: new Date(),
            },
          });

          // Return user object for session
          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
          };
        } catch (error) {
          console.error('Error during authentication:', error);
          return null;
        }
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
        nextUrl.pathname.startsWith('/family') ||
        nextUrl.pathname.startsWith('/operations') ||
        nextUrl.pathname.startsWith('/super-admin');

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      } else if (isLoggedIn) {
        // Redirect logged in users from login/register to their dashboard
        if (nextUrl.pathname === '/login' || nextUrl.pathname === '/register') {
          const role = auth.user?.role?.toLowerCase() || 'patient';
          const dashboardPaths: Record<string, string> = {
            admin: '/admin',
            super_admin: '/super-admin',
            operations_manager: '/operations',
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
