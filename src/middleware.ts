import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

// Define protected routes and their required permissions
const protectedRoutes: Record<string, {
  permissions?: string[]
  roles?: string[]
  requireAuth?: boolean
}> = {
  '/admin': {
    roles: ['administrator'],
    requireAuth: true,
  },
  '/admin/users': {
    permissions: ['user:read'],
    requireAuth: true,
  },
  '/admin/roles': {
    permissions: ['role:read'],
    requireAuth: true,
  },
  '/agent': {
    roles: ['agent', 'administrator'],
    requireAuth: true,
  },
  '/agent/properties': {
    permissions: ['property:read'],
    requireAuth: true,
  },
  '/agent/projects': {
    permissions: ['project:read'],
    requireAuth: true,
  },
  '/agent/reports': {
    permissions: ['report:sales', 'report:analytics'],
    requireAuth: true,
  },
  '/dashboard': {
    requireAuth: true,
  },
  '/profile': {
    requireAuth: true,
  },
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the route needs protection
  const routeConfig = findMatchingRoute(pathname, protectedRoutes)
  
  if (!routeConfig) {
    return NextResponse.next()
  }

  // Get session
  const session = await auth()
  
  // Check if authentication is required
  if (routeConfig.requireAuth && !session) {
    const url = new URL('/auth/signin', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // If no session but auth is required, redirect to sign in
  if (!session && routeConfig.requireAuth) {
    const url = new URL('/auth/signin', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // If session exists, check roles and permissions
  if (session) {
    // Check roles
    if (routeConfig.roles) {
      const hasRequiredRole = routeConfig.roles.some(role =>
        session.user.roles?.some(userRole => userRole.name === role)
      )
      
      if (!hasRequiredRole) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }

    // Check permissions
    if (routeConfig.permissions) {
      const hasRequiredPermission = routeConfig.permissions.some(permission =>
        session.user.permissions?.includes(permission)
      )
      
      if (!hasRequiredPermission) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }
  }

  return NextResponse.next()
}

/**
 * Find the most specific matching route configuration
 */
function findMatchingRoute(
  pathname: string, 
  routes: Record<string, {
    permissions?: string[]
    roles?: string[]
    requireAuth?: boolean
  }>
): {
  permissions?: string[]
  roles?: string[]
  requireAuth?: boolean
} | null {
  // Sort routes by specificity (longer paths first)
  const sortedRoutes = Object.keys(routes).sort((a, b) => b.length - a.length)
  
  for (const route of sortedRoutes) {
    if (pathname.startsWith(route)) {
      return routes[route]
    }
  }
  
  return null
}

// Configure which routes should be processed by this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public/).*)',
  ],
}