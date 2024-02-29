'use server'

import { LoginSchema } from '@/schemas'
import * as z from 'zod'

import { signIn } from '@/auth'
import { getUserByEmail } from '@/data/user'
import { generateTwoFactorToken, generateVerificationToken } from '@/lib/tokens'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { AuthError } from 'next-auth'
import { sendTwoFactorTokenEmail, sendVerificationEmail } from '@/lib/mail'
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token'
import { db } from '@/lib/db'
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-comfirmation'

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: 'Invalid fields' }
    }

    const { email, password, code } = validatedFields.data

    const existingUser = await getUserByEmail(email)
    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: 'Email not found' }
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(
            existingUser.email
        )

        await sendVerificationEmail(existingUser.email, verificationToken.token)

        return {
            success:
                'Confirmation email sent. Please verify your email before logging in.',
        }
    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(
                existingUser.email
            )

            if (!twoFactorToken || twoFactorToken.token !== code) {
                return { error: 'Invalid two factor code' }
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date()
            if (hasExpired) {
                return { error: 'Two factor code expired' }
            }

            await db.twoFactorToken.delete({ where: { id: twoFactorToken.id } })

            const existingComfirmation = await getTwoFactorConfirmationByUserId(
                existingUser.id
            )
            if (existingComfirmation) {
                await db.twoFactorConfirmation.delete({
                    where: { id: existingComfirmation.id },
                })
            }

            await db.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id,
                },
            })
            
        } else {
            const twoFactorToken = await generateTwoFactorToken(
                existingUser.email
            )

            await sendTwoFactorTokenEmail(
                twoFactorToken.email,
                twoFactorToken.token
            )

            return {
                twoFactor: true,
            }
        }
    }

    try {
        await signIn('credentials', {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Invalid credentials' }
                default:
                    return { error: 'Something went wrong' }
            }
        }

        throw error
    }
}
