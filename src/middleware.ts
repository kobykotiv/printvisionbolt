import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { featureService } from './services/features';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('supabase-auth-token');
  
  // Allow auth-related routes
  if (request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  // If no session, redirect to login
  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Get user ID from session
  const userId = JSON.parse(session.value).user.id;

  // Check feature access based on URL patterns
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const hasAccess = await featureService.checkFeatureAccess(userId, 'dashboard');
    if (!hasAccess) {
      return NextResponse.redirect(new URL('/upgrade', request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith('/analytics')) {
    const hasAccess = await featureService.checkFeatureAccess(userId, 'analytics');
    if (!hasAccess) {
      return NextResponse.redirect(new URL('/upgrade', request.url));
    }
  }

  // Add other feature-gated routes here

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/analytics/:path*',
    '/settings/:path*',
    '/api/:path*',
  ],
};
