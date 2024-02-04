'use server'

import bcrypt from 'bcrypt'
import * as z from 'zod'
import { RegisterSchema } from '@/schemas'
import { db } from '@/lib/db'
import { getUserByEmail } from '@/data/user'

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: 'Invalid fields' }
    }

    const { email, password, name } = validatedFields.data
    const hashedPassword = await bcrypt.hash(password, 10)

    // Email is not taken
    const existingUser = await getUserByEmail(email)

    if (existingUser) {
        return { error: 'Email already taken' }
    }

    // Create user
    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    })

    // TODO: Send verification token email

    return { success: 'User created' }
}
