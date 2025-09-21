import { withAuth } from "next-auth/middleware"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // Add any additional middleware logic here
    console.log("Middleware:", req.nextauth.token)
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth/* (authentication pages)
     * - / (home page - public)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|auth|$).*)",
  ],
}