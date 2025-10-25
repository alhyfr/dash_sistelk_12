import { NextResponse } from 'next/server'

// Routes that don't require authentication
const publicRoutes = ['/login', '/esurat', '/forgot-password', '/reset-password']

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/profile', '/settings', '/persuratan/sk']

// Admin only routes
const adminRoutes = ['/admin', '/users', '/roles']

export function middleware(request) {
  const { pathname } = request.nextUrl
  
  // Get token from cookies or headers
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  // Check if route is admin only
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))

  // If accessing public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // If no token and trying to access protected route
  if (!token && (isProtectedRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If token exists, verify it
  if (token) {
    try {
      // Decode JWT token (without verification for now)
      const payload = JSON.parse(atob(token.split('.')[1]))
      
      // Check if token is expired
      if (payload.exp && payload.exp < Date.now() / 1000) {
        // Token expired, redirect to login
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('token')
        return response
      }

      // Add user info to headers for API routes
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', payload.id)
      requestHeaders.set('x-user-email', payload.email)
      requestHeaders.set('x-user-role', payload.role)

      // Check admin routes
      if (isAdminRoute && payload.role !== 1) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      // Allow access to protected routes
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })

    } catch (error) {
      // Invalid token, redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('token')
      return response
    }
  }

  // If no token and accessing root path, redirect to login
  if (pathname === '/' && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Default: allow access
  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
