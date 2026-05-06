import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the user has the age verification token
  const hasToken = request.cookies.has('age_token');
  
  // Skip middleware for static files, API routes, and the verification page itself
  const isVerificationPage = request.nextUrl.pathname.startsWith('/age-verification');
  const isStaticAsset = request.nextUrl.pathname.startsWith('/_next') || 
                        request.nextUrl.pathname.includes('.') ||
                        request.nextUrl.pathname.startsWith('/api');

  if (!hasToken && !isVerificationPage && !isStaticAsset) {
    // Redirect unverified users to the age verification page
    return NextResponse.redirect(new URL('/age-verification', request.url));
  }

  // If verified but trying to access age-verification, redirect to home
  if (hasToken && isVerificationPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, logo.png (static assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)',
  ],
};
