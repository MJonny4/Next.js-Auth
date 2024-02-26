import authConfig from '@/auth.config'
import NextAuth from 'next-auth'

import { getUserById } from '@/data/user'
import { db } from '@/lib/db'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { getTwoFactorConfirmationByUserId } from './data/two-factor-comfirmation'

declare module 'next-auth' {
    interface User {
        /** The user's postal address. */
        role: string
    }
}

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    pages: {
        signIn: '/auth/login',
        error: '/auth/error',
    },
    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() },
            })
        },
    },
    callbacks: {
        // async signIn({ user }) {
        //     const existingUser = await getUserById(user.id)
        //     if (!existingUser || !existingUser.emailVerified) return false
        //     return true
        // },
        async signIn({ user, account }) {
            if (account?.provider !== 'credentials') return true

            const existingUser = await getUserById(user.id)
            if (!existingUser || !existingUser.emailVerified) return false

            if (existingUser.isTwoFactorEnabled) {
                const twoFactorConfirmation =
                    await getTwoFactorConfirmationByUserId(existingUser.id)
                if (!twoFactorConfirmation) return false

                // TODO: Delete 2FA after successful login
                await db.twoFactorConfirmation.delete({
                    where: {
                        id: twoFactorConfirmation.id,
                    },
                })
            }

            return true
        },
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }

            if (token.role && session.user) {
                session.user.role = token.role as string
            }

            return session
        },
        async jwt({ token }) {
            if (!token.sub) return token

            const existingUser = await getUserById(token.sub)
            if (!existingUser) return token

            token.role = existingUser.role

            return token
        },
    },
    adapter: PrismaAdapter(db),
    session: { strategy: 'jwt' },
    ...authConfig,
})
