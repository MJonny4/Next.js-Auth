'use server'

import { db } from '@/lib/db'
import * as z from 'zod'

import { getUserById } from '@/data/user'
import { currentUser } from '@/hooks/auth'
import { SettingsSchema } from '@/schemas'

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
    const user = await currentUser()
    if (!user) {
        return {
            error: 'User not found',
        }
    }

    const dbUser = await getUserById(user?.id)
    if (!dbUser) {
        return {
            error: 'User not authorized',
        }
    }

    await db.user.update({
        where: {
            id: user.id,
        },
        data: {
            ...values,
        },
    })

    return {
        success: 'Settings updated',
    }
}
