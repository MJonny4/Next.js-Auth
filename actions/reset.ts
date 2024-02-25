'use server'

import { getUserByEmail } from '@/data/user'
import { sendPasswordResetEmail } from '@/lib/mail'
import { generatePasswordResetToken } from '@/lib/tokens'
import { ResetSchema } from '@/schemas'
import * as z from 'zod'

export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: 'Invalid Email' }
    }

    const { email } = validatedFields.data

    const existingUser = await getUserByEmail(email)
    if (!existingUser || !existingUser.email) {
        return { error: 'Email not found' }
    }

    const passwordResetToken = await generatePasswordResetToken(email)
    await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token
    )

    return {
        success:
            'If the email exists in our system, we will send a password reset link.',
    }
}