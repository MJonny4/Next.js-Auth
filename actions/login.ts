'use server'

import { LoginSchema } from '@/schemas'
import * as z from 'zod'

import { signIn } from '@/auth'
import { getUserByEmail } from '@/data/user'
import { generateVerificationToken } from '@/lib/tokens'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { AuthError } from 'next-auth'
import { sendVerificationEmail } from '@/lib/mail'

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: 'Invalid fields' }
    }

    const { email, password } = validatedFields.data

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
