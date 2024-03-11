import { Request, Response } from 'express'
import { ContactUsRequestBody, VerificationMailRequestBody } from '../../models/utility.js'
import { loggerService } from '../../services/logger.service.js'
import { mailService } from './mail.service.js'

export async function sendContactUsMail(req: Request<ContactUsRequestBody>,
    res: Response): Promise<void> {
    const { name, email, title, message, recaptchaToken } = req.body
    loggerService.debug(`Received contact form data: ${name}, ${email}, ${title}, ${message}, ${recaptchaToken}`)

    try {
        await mailService.sendContactUsMail(name, email, title, message, recaptchaToken)
        res.status(200).send({ msg: 'Mail successfully sent' })
    } catch (error) {
        loggerService.error('Failed sending mail: ' + error)
        res.status(500).send({ error: 'Failed sending mail' })
    }
}

export async function sendVerificationMail(req: Request<VerificationMailRequestBody>,
    res: Response): Promise<void> {
    const { username, email, code } = req.body
    loggerService.debug(`Received verify form data: ${username}, ${email}, ${code}`)

    try {
        await mailService.sendVerificationMail(username, email, code)
        res.status(200).send({ msg: 'Mail successfully sent' })
    } catch (error) {
        loggerService.error('Failed sending mail: ' + error)
        res.status(500).send({ error: 'Failed sending mail' })
    }
}