import nodemailer, { Transporter } from 'nodemailer'
import { Order } from '../../models/order.js'
import { MailOptions } from '../../models/utility.js'
import { loggerService } from '../../services/logger.service.js'
import { utilityService } from '../../services/utility.service.js'

export const mailService = {
    sendContactUsMail,
    sendVerificationMail,
    sendCustomerInvoice,
    sendArtistInvoice
}

async function sendContactUsMail(name: string, email: string, title: string, message: string, recaptchaToken: string): Promise<void> {
    await utilityService.verifyRecaptcha(recaptchaToken)

    loggerService.debug(`Sending email containing: ${name}, ${email}, ${title}, ${message}`)
    const mailOptions: MailOptions = {
        from: process.env.SENDER_GMAIL_ADDRESS ?? '',
        to: process.env.RECEIVER_EMAIL_ADDRESS ?? '',
        replyTo: email,
        subject: `From ${name}, topic: ${title}`,
        text: `${message}, This message was sent by ${name}. Contact him back via this email: ${email}, or by pressing the Reply button.`,
        html: `
            <p>${message}</p>
            <hr>
            <p>This message was sent by <b>${name}</b>.</p>
            <p>Contact him back via the email <b>${email}</b>, or by pressing the Reply button.</p>`,
    }
    await _sendEmail(mailOptions)
}

async function sendVerificationMail(username: string, email: string, code: string): Promise<void> {
    loggerService.debug(`Sending auth email containing: ${username}, ${email}, ${code}`)
    const mailOptions: MailOptions = {
        from: process.env.SENDER_GMAIL_ADDRESS ?? '',
        to: email,
        subject: `Verify your account`,
        text: `Dear ${username}, To verify your account, please use the following code: ${code}. If you did not request this, just ignore this email.`,
        html: `
            <p>Dear ${username},</p>
            <p>To verify your account, please use the following code:</p>
            <p><b>${code}</b></p>
            <p>If you did not request this, just ignore this email.</p>
            <p>Thank you,<br>The Support Team</p>`,
    }
    await _sendEmail(mailOptions)
}

async function sendCustomerInvoice(orderDetails: Order): Promise<void> {
    loggerService.debug(`Sending email invoice #${orderDetails.createdAt} to ${orderDetails.user.email}`)
    const { invoiceDate, orderSummaryHtml, expensesHtml, orderSummaryText, expensesText } = _prepareInvoice(orderDetails)

    const mailOptions: MailOptions = {
        from: process.env.SENDER_GMAIL_ADDRESS ?? '',
        to: orderDetails.user.email,
        subject: `Your Ori Carlin purchase #${orderDetails.createdAt}`,
        text: `Hello ${orderDetails.user.firstName},
        Thank you for shopping with us.
        We'll send you a confirmation when your order ships.
        Invoice: #${orderDetails.createdAt}
        Date issued: ${invoiceDate}
        Purchased products:
        ${orderSummaryText}
        Expenses:
        ${expensesText}
        Payment method: ${orderDetails.payment}.
        This is your order confirmation, for any questions, please contact us through the site.
        Thank you, The Ori Carlin Team`,
        html: `
            <p>Hello ${orderDetails.user.firstName},</p>
            <p>Thank you for shopping with us.</p>
            <p>We'll send you a confirmation when your order ships.</p>
            <hr>
            <p>Invoice: #${orderDetails.createdAt}</p>
            <p>Date issued ${invoiceDate},</p>
            <table border="1" style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderSummaryHtml}
                    ${expensesHtml}
                </tbody>
            </table>
            <p>Payment method: ${orderDetails.payment}</p>
            <br>
            <p>This is your order confirmation, for any questions, please contact us through the <a href="https://www.oricarlin.com">site</a>.</p>
            <p>Thank you,<br>The Ori Carlin Team</p>`,
    }
    await _sendEmail(mailOptions)
}

async function sendArtistInvoice(orderDetails: Order): Promise<void> {
    loggerService.debug(`Informing Ori Carlin of a new order, #${orderDetails.createdAt}`)
    const { invoiceDate, orderSummaryHtml, expensesHtml, orderSummaryText, expensesText } = _prepareInvoice(orderDetails)

    const mailOptions: MailOptions = {
        from: process.env.SENDER_GMAIL_ADDRESS ?? '',
        to: 'valerykuvshinuv@gmail.com',
        subject: `New Order Received: #${orderDetails.createdAt}`,
        text: `Dear Ori Carlin,
        You've got a new order, from ${orderDetails.user.firstName} ${orderDetails.user.lastName}!
        Invoice: #${orderDetails.createdAt}
        Date issued: #${invoiceDate}
        Products sold:
        ${orderSummaryText}
        Profits:
        ${expensesText}
        This email was auto-generated. Please keep it, incase of a refund request from the customer.
        Have an inspirational day!`,
        html: `
            <p>Dear Ori Carlin,</p>
            <p>You've got a new order, from ${orderDetails.user.firstName} ${orderDetails.user.lastName}!</p>
            <hr>
            <p>Invoice: #${orderDetails.createdAt}</p>
            <p>Date issued: ${invoiceDate}</p>
            <table border="1" style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderSummaryHtml}
                    ${expensesHtml}
                </tbody>
            </table>
            <p>Payment method: ${orderDetails.payment}</p>
            <br>
            <p>This email was auto-generated. Please keep it, incase of a refund request from the customer.</p>
            <p>Have an inspirational day!</p>`,
    }
    await _sendEmail(mailOptions)
}

// prepare html and text elements for invoice mail
function _prepareInvoice(orderDetails: Order) {
    const invoiceDate = new Date(orderDetails.createdAt).toLocaleString("en-US", {
        timeZone: "America/New_York", month: 'short', day: '2-digit',
        year: 'numeric', hour: 'numeric', minute: '2-digit',
        second: '2-digit', hour12: true
    })
    const orderSummaryHtml = orderDetails.summary.map(item =>
        `<tr>
            <td>${item.name ?? 'N/A'}</td>
            <td>${item.amount ?? 0}</td>
            <td>$${(item.price ?? 0).toFixed(2)}</td>
            <td>$${((item.amount ?? 0) * (item.price ?? 0)).toFixed(2)}</td>
        </tr>`
    ).join('')
    const expensesHtml = `
        <tr><td colspan="3">Subtotal</td><td>$${orderDetails.expenses.total.toFixed(2)}</td></tr>
        <tr><td colspan="3">Taxes</td><td>$${orderDetails.expenses.taxes.toFixed(2)}</td></tr>
        <tr><td colspan="3">Delivery Fee</td><td>$${orderDetails.expenses.deliveryFee.toFixed(2)}</td></tr>
        <tr><td colspan="3"><strong>Grand Total</strong></td><td><strong>$${orderDetails.expenses.grandTotal.toFixed(2)}</strong></td></tr>
    `
    const orderSummaryText = orderDetails.summary.map(item =>
        `${item.name ?? 'N/A'} - Quantity: ${item.amount ?? 0}, Price: $${(item.price ?? 0).toFixed(2)}, Total: $${((item.amount ?? 0) * (item.price ?? 0)).toFixed(2)}`
    ).join('\n')
    const expensesText = `
        Subtotal: $${orderDetails.expenses.total.toFixed(2)}
        Taxes: $${orderDetails.expenses.taxes.toFixed(2)}
        Delivery Fee: $${orderDetails.expenses.deliveryFee.toFixed(2)}
        Grand Total: $${orderDetails.expenses.grandTotal.toFixed(2)}
    `
    return { invoiceDate, orderSummaryHtml, expensesHtml, orderSummaryText, expensesText }
}

// generic function to send emails using your MailOptions interface
async function _sendEmail(mailOptions: MailOptions): Promise<void> {
    const transporter = _createTransporter()
    try {
        await transporter.sendMail(mailOptions)
        loggerService.debug('Email sent successfully')
    } catch (error) {
        loggerService.error('Error sending email:', error)
        throw error
    }
}

// utility function to create and return a transporter
function _createTransporter(): Transporter {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENDER_GMAIL_ADDRESS ?? '',
            pass: process.env.SENDER_GMAIL_PASSWORD ?? '',
        },
    })
}