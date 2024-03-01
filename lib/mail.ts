import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const domain = process.env.NEXT_APP_PUBLIC_URL

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
    const htmlMessage = `
        <div style="font-family: Arial, sans-serif; font-size: 16px; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
            <h2 style="text-align: center;">Two-factor authentication token</h2>
            <p>Your two-factor authentication token is: <strong style="color:blue;">${token}</strong></p>
        </div>
    `

    await resend.emails.send({
        from: 'mail@ximuntion.dev',
        to: email,
        subject: 'Two-factor authentication token',
        html: htmlMessage,
    })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${domain}/auth/new-password?token=${token}`

    const htmlText = `
        <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
    `

    await resend.emails.send({
        from: 'mail@ximuntion.dev',
        to: email,
        subject: 'Password reset request',
        html: htmlText,
    })
}

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`

    const htmlText = `
        <p>Click <a href="${confirmLink}">here</a> to verify your email.</p>
    `

    await resend.emails.send({
        from: 'mail@ximuntion.dev',
        to: email,
        subject: 'Please verify your email',
        html: htmlText,
    })
}
