import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/((?!register).*)'])

export default clerkMiddleware((auth, req) => {
  const res = NextResponse.next()
  res.headers.set('x-pathname', req.nextUrl.pathname)
  return res
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
