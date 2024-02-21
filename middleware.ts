import authConfig from '@/auth.config'
import NextAuth from 'next-auth'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const isLoggedIn = !!req.auth
    console.log('ROUTE: ', req.nextUrl.pathname)
    console.log('isLoggedIn: ', isLoggedIn)
})

// Optionally, don't invoke Middleware on some paths
export const config = {
    // matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
    // matcher: ['/auth/login', '/auth/register'],
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
