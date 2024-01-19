import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting setup (simplified - use Redis in production)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

export default authMiddleware({
  publicRoutes: ['/', '/sign-in(.*)', '/sign-up(.*)', '/api/webhooks(.*)'],
  ignoredRoutes: ['/api/health'],
  afterAuth(auth, req) {
    // Handle rate limiting for API routes
    if (req.nextUrl.pathname.startsWith('/api/')) {
      const ip = req.ip || 'anonymous';
      const now = Date.now();
      const limit = rateLimit.get(ip);
      const windowMs = 60000; // 1 minute
      const maxRequests = 50;

      if (limit && now < limit.resetTime) {
        if (limit.count >= maxRequests) {
          return new NextResponse('Too Many Requests', { status: 429 });
        }
        limit.count++;
      } else {
        rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
      }
    }
    return NextResponse.next();
  },
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};