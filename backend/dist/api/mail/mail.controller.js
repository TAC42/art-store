import express from 'express';
import { loggerService } from '../../services/logger.service.js';
import { mailService } from './mail.service.js';
// mail routes
export const mailRoutes = express.Router();
mailRoutes.post('/contact', _sendContactUsMail);
mailRoutes.post('/verify', _sendVerificationMail);
mailRoutes.post('/invoice', _sendInvoices);
// mail controller functions
async function _sendContactUsMail(req, res) {
    const { name, email, title, message, recaptchaToken } = req.body;
    loggerService.debug(`Received contact form data: ${name}, ${email}, ${title}, ${message}, ${recaptchaToken}`);
    try {
        await mailService.sendContactUsMail(name, email, title, message, recaptchaToken);
        res.status(200).send({ msg: 'Mail successfully sent' });
    }
    catch (error) {
        loggerService.error('Failed sending mail: ' + error);
        res.status(500).send({ error: 'Failed sending mail' });
    }
}
async function _sendVerificationMail(req, res) {
    const { username, email, code } = req.body;
    loggerService.debug(`Received verify form data: ${username}, ${email}, ${code}`);
    try {
        await mailService.sendVerificationMail(username, email, code);
        res.status(200).send({ msg: 'Mail successfully sent' });
    }
    catch (error) {
        loggerService.error('Failed sending mail: ' + error);
        res.status(500).send({ error: 'Failed sending mail' });
    }
}
async function _sendInvoices(req, res) {
    const orderDetails = req.body;
    loggerService.debug(`Received order form data: ${JSON.stringify(orderDetails)}`);
    try {
        await mailService.sendCustomerInvoice(orderDetails);
        await mailService.sendArtistInvoice(orderDetails);
        res.status(200).send({ msg: 'Mail successfully sent' });
    }
    catch (error) {
        loggerService.error('Failed sending mail: ' + error);
        res.status(500).send({ error: 'Failed sending mail' });
    }
}
