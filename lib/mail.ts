import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `http://localhost:3000/auth/new-password?token=${token}`

    const htmlText = `
        <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
    `

    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Password reset request',
        html: htmlText,
    })
}

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`

    const htmlText = `
        <p>Click <a href="${confirmLink}">here</a> to verify your email.</p>
    `

    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Please verify your email',
        html: htmlText,
    })
}
