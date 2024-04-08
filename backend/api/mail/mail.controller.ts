import express, { Router, Request, Response } from 'express'
import { ContactUsRequestBody, VerificationMailRequestBody } from '../../models/utility.js'
import { Order } from '../../models/order.js'
import { loggerService } from '../../services/logger.service.js'
import { mailService } from './mail.service.js'

// mail routes
export const mailRoutes: Router = express.Router()

mailRoutes.post('/contact', _sendContactUsMail)
mailRoutes.post('/verify', _sendVerificationMail)
mailRoutes.post('/reset', _sendResetCodeMail)
mailRoutes.post('/user-reset', _sendUserUpdatedMail)
mailRoutes.post('/invoice', _sendInvoices)
mailRoutes.post('/order-update', _sendOrderStatusMail)

// mail controller functions
async function _sendContactUsMail(req: Request<ContactUsRequestBody>,
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

async function _sendVerificationMail(req: Request<VerificationMailRequestBody>,
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

async function _sendResetCodeMail(req: Request<VerificationMailRequestBody>,
    res: Response): Promise<void> {
    const { email, code } = req.body
    loggerService.debug(`Received reset code form data: ${email}, ${code}`)

    try {
        await mailService.sendResetCodeMail(email, code)
        res.status(200).send({ msg: 'Mail successfully sent' })
    } catch (error) {
        loggerService.error('Failed sending mail: ' + error)
        res.status(500).send({ error: 'Failed sending mail' })
    }
}

async function _sendUserUpdatedMail(req: Request<VerificationMailRequestBody>,
    res: Response): Promise<void> {
    const { username, email } = req.body
    loggerService.debug(`Received user updated form data: ${username}, ${email}`)

    try {
        await mailService.sendUserUpdatedMail(username, email)
        res.status(200).send({ msg: 'Mail successfully sent' })
    } catch (error) {
        loggerService.error('Failed sending mail: ' + error)
        res.status(500).send({ error: 'Failed sending mail' })
    }
}

async function _sendInvoices(req: Request<Order>,
    res: Response): Promise<void> {
    const orderDetails = req.body
    loggerService.debug(`Received order form data: ${JSON.stringify(orderDetails)}`)

    try {
        await mailService.sendCustomerInvoice(orderDetails)
        await mailService.sendArtistInvoice(orderDetails)
        res.status(200).send({ msg: 'Mail successfully sent' })
    } catch (error) {
        loggerService.error('Failed sending mail: ' + error)
        res.status(500).send({ error: 'Failed sending mail' })
    }
}

async function _sendOrderStatusMail(req: Request<Order>,
    res: Response): Promise<void> {
    const orderDetails = req.body
    loggerService.debug(`Received order data for update mail: ${JSON.stringify(orderDetails)}`)

    try {
        await mailService.sendOrderStatusMail(orderDetails)
        res.status(200).send({ msg: 'Mail successfully sent' })
    } catch (error) {
        loggerService.error('Failed sending mail: ' + error)
        res.status(500).send({ error: 'Failed sending mail' })
    }
}