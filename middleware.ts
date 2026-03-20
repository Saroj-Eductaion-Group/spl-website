import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/register(.*)', '/register', '/my-registration'])
const isAuthRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const res = NextResponse.next()
  const { userId } = await auth()

  // SSO callback must always be accessible
  if (req.nextUrl.pathname.startsWith('/sso-callback')) return res

  // Already signed-in Clerk users shouldn't see sign-in/sign-up
  if (isAuthRoute(req) && userId) {
    return NextResponse.redirect(new URL('/register', req.url))
  }

  if (isProtectedRoute(req) && !userId) {
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('redirect_url', req.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  return res
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
