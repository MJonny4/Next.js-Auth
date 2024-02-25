'use server'

import * as z from 'zod'
import { getUserByEmail } from '@/data/user'
import { ResetSchema } from '@/schemas'

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

    // TODO: Generate reset token and send email

    return { success: 'Confirmation email sent. Please verify your email before logging in.' }
}