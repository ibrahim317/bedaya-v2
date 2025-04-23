import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Use the proper way to get the token in Edge runtime
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET, // Make sure this is set in your .env
    secureCookie: process.env.NODE_ENV === 'production'
  });
  
  const { pathname } = request.nextUrl;
  
  // Check if the pathname is a protected route (dashboard)
  const isProtectedRoute = pathname.startsWith('/dashboard');
  
  // Check if the pathname is an auth route (login or register)
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
  
  // If user is not authenticated and trying to access a protected route
  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }
  
  // If user is authenticated and trying to access an auth route
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};