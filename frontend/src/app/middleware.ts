import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: '/profile',
};
