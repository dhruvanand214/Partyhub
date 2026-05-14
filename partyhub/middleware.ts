import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/', 
  '/age-verification',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhook/clerk'
]);

export default clerkMiddleware(async (auth, request) => {
  // 1. Strict Age Verification Logic
  const hasToken = request.cookies.has('age_token');
  const isVerificationPage = request.nextUrl.pathname.startsWith('/age-verification');
  const isWebhook = request.nextUrl.pathname.includes('/api/webhook');
  
  // If they don't have an age token, and they aren't on the verification page or a backend webhook,
  // FORCE them to the age verification page. This protects /sign-in and /sign-up as well.
  if (!hasToken && !isVerificationPage && !isWebhook) {
    return NextResponse.redirect(new URL('/age-verification', request.url));
  }

  // If they already verified but try to go back to the verification page, send them home
  if (hasToken && isVerificationPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. Clerk Authentication Logic
  // Only protect routes that are not explicitly marked as public
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
