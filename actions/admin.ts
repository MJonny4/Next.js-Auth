'use server'

import { currentRole } from '@/hooks/auth'
import { UserRole } from '@prisma/client'

export const admin = async () => {
    const role = await currentRole()

    if (role !== UserRole.ADMIN) {
        return {
            success: '403 Unauthorized',
        }
    }

    return {
        error: 'Admin action succeeded',
    }
}
