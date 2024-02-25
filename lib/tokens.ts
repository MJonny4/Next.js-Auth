import { getPasswordResetTokenByEmail } from '@/data/password-reset-token'
import { getVerificationTokenByEmail } from '@/data/verification-user'
import { db } from '@/lib/db'
import { v4 as uuidV4 } from 'uuid'

export const generatePasswordResetToken = async (email: string) => {
    const token = uuidV4()
    const expires = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes from now

    const existingToken = await getPasswordResetTokenByEmail(email)
    if (existingToken) {
        await db.passwordResetToken.delete({
            where: {
                id: existingToken.id,
            },
        })
    }

    const passwordResetToken = await db.passwordResetToken.create({
        data: {
            email,
            token,
            expires,
        },
    })

    return passwordResetToken
}

export const generateVerificationToken = async (email: string) => {
    const token = uuidV4()
    const expires = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes from now

    const existingToken = await getVerificationTokenByEmail(email)
    if (existingToken) {
        await db.verificationToken.delete({
            where: {
                id: existingToken.id,
            },
        })
    }

    const verificationToken = await db.verificationToken.create({
        data: {
            email,
            token,
            expires,
        },
    })

    return verificationToken
}