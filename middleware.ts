import { auth } from '@/lib/auth';

export default auth;

export const config = {
  matcher: [
    // Protected routes
    '/dispatcher/:path*',
    '/driver/:path*',
    '/admin/:path*',
    '/facility/:path*',
    '/patient/:path*',
    '/family/:path*',
    // Auth routes (for redirect logic)
    '/login',
    '/register',
  ],
};
