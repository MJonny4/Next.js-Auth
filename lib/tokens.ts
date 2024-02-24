import { getVerificationTokenByEmail } from '@/data/verification-user'
import { db } from '@/lib/db'
import { v4 as uuidV4 } from 'uuid'

export const generateVerificationToken = async (email: string) => {
    const token = uuidV4()
    // TODO: Fix this!
    const expires = new Date().getTime() + 3600 * 1000 // 1 hour from now

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
            expires: new Date(expires), // Convert expires to a Date object
        },
    })

    return verificationToken
}
