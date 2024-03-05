export interface ContactUsRequestBody {
    name: string
    email: string
    title: string
    message: string
    recaptchaToken: string
}

export interface VerificationMailRequestBody {
    username: string
    email: string
    code: string
}

export interface RecaptchaResponse {
    success: boolean
    'error-codes'?: string[]
}

export interface MailOptions {
    from: string
    to: string
    replyTo?: string
    subject: string
    text: string
    html: string
}