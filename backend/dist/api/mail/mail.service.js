import nodemailer from 'nodemailer';
import { loggerService } from '../../services/logger.service.js';
import { utilityService } from '../../services/utility.service.js';
export const mailService = {
    sendContactUsMail,
    sendVerificationMail,
    sendResetPasswordMail,
    sendPasswordUpdateMail,
    sendCustomerInvoice,
    sendArtistInvoice
};
async function sendContactUsMail(name, email, title, message, recaptchaToken) {
    await utilityService.verifyRecaptcha(recaptchaToken);
    loggerService.debug(`Sending email containing: ${name}, ${email}, ${title}, ${message}`);
    const mailOptions = {
        from: process.env.SENDER_GMAIL_ADDRESS ?? '',
        to: process.env.RECEIVER_EMAIL_ADDRESS ?? '',
        replyTo: email,
        subject: `From ${name}, topic: ${title}`,
        text: `${message}, This message was sent by ${name}.
        Contact him back via this email: ${email}, or by pressing the Reply button.`,
        html: `
            <p>${message}</p>
            <hr>
            <p>This message was sent by <b>${name}</b>.</p>
            <p>Contact him back via the email <b>${email}</b>, or by pressing the Reply button.</p>`,
    };
    await _sendEmail(mailOptions);
}
async function sendVerificationMail(username, email, code) {
    loggerService.debug(`Sending auth email containing: ${username}, ${email}, ${code}`);
    const mailOptions = {
        from: process.env.SENDER_GMAIL_ADDRESS ?? '',
        to: email,
        subject: `Verify your account`,
        text: `Dear ${username}, In order to continue using our site,
        we'll need you to verify your account.
        Please use the following code to complete the process: ${code}.
        If you did not request this, you may ignore this email.`,
        html: `
            <p>Dear ${username},</p>
            <p>In order to continue using our site, we'll need you to verify your account.</p>
            <p>Please use the following code to complete the process:</p>
            <p><b>${code}</b></p>
            <hr>
            <p>If you did not request this, you may ignore this email.</p>
            <p>Thank you,<br>The Ori Carlin Team</p>`,
    };
    await _sendEmail(mailOptions);
}
async function sendResetPasswordMail(email, code) {
    loggerService.debug(`Sending reset password email containing: ${email}, ${code}`);
    const mailOptions = {
        from: process.env.SENDER_GMAIL_ADDRESS ?? '',
        to: email,
        subject: `Reset password at Ori-Carlin`,
        text: `Dear user, To proceed with reseting the password of your account,
        please copy the following code: ${code}.
        Do not give this code to anyone!
        If you did not request a password reset, please ignore this email or contact us through the site.`,
        html: `
            <p>Dear user,</p>
            <p>To proceed with reseting the password of your account, please copy the following code:</p>
            <p><b>${code}</b></p>
            <p>Do not give this code to anyone!</p>
            <hr>
            <p>If you did not request a password reset, please ignore this email or contact us through the site.</p>
            <p>Thank you,<br>The Ori Carlin Team</p>`,
    };
    await _sendEmail(mailOptions);
}
async function sendPasswordUpdateMail(username, email) {
    loggerService.debug(`Sending password update email containing: ${username}, ${email}`);
    const mailOptions = {
        from: process.env.SENDER_GMAIL_ADDRESS ?? '',
        to: email,
        subject: `Account Password updated at Ori-Carlin`,
        text: `Dear ${username}, we noticed that your account's password has changed recently.
        We sent you this email to be sure, that you were the one who made the change.
        If you did not perform this action, do not hesitate and contact us ASAP!`,
        html: `
            <p>Dear ${username},</p>
            <p>We noticed that your account's password has changed recently.</p>
            <p>We sent you this email to be sure, that you were the one who made the change.</p>
            <hr>
            <p>If you did not perform this action, do not hesitate and contact us ASAP!</p>
            <p>Thank you,<br>The Ori Carlin Team</p>`,
    };
    await _sendEmail(mailOptions);
}
async function sendCustomerInvoice(orderDetails) {
    loggerService.debug(`Sending email invoice #${orderDetails.createdAt} to ${orderDetails.user.email}`);
    const { invoiceDate, orderSummaryHtml, expensesHtml, orderSummaryText, expensesText } = _prepareInvoice(orderDetails);
    const mailOptions = {
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
    };
    await _sendEmail(mailOptions);
}
async function sendArtistInvoice(orderDetails) {
    loggerService.debug(`Informing Ori Carlin of a new order, #${orderDetails.createdAt}`);
    const { invoiceDate, orderSummaryHtml, expensesHtml, orderSummaryText, expensesText } = _prepareInvoice(orderDetails);
    const mailOptions = {
        from: process.env.SENDER_GMAIL_ADDRESS ?? '',
        to: process.env.SENDER_GMAIL_ADDRESS ?? '',
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
    };
    await _sendEmail(mailOptions);
}
// prepare html and text elements for invoice mail
function _prepareInvoice(orderDetails) {
    const invoiceDate = new Date(orderDetails.createdAt).toLocaleString("en-US", {
        timeZone: "America/New_York", month: 'short', day: '2-digit',
        year: 'numeric', hour: 'numeric', minute: '2-digit',
        second: '2-digit', hour12: true
    });
    const orderSummaryHtml = orderDetails.summary.map(item => `<tr>
            <td>${item.name ?? 'N/A'}</td>
            <td>${item.amount ?? 0}</td>
            <td>$${(item.price ?? 0).toFixed(2)}</td>
            <td>$${((item.amount ?? 0) * (item.price ?? 0)).toFixed(2)}</td>
        </tr>`).join('');
    const expensesHtml = `
        <tr><td colspan="3">Subtotal</td><td>$${orderDetails.expenses.total.toFixed(2)}</td></tr>
        <tr><td colspan="3">Taxes</td><td>$${orderDetails.expenses.taxes.toFixed(2)}</td></tr>
        <tr><td colspan="3">Delivery Fee</td><td>$${orderDetails.expenses.deliveryFee.toFixed(2)}</td></tr>
        <tr><td colspan="3"><strong>Grand Total</strong></td><td><strong>$${orderDetails.expenses.grandTotal.toFixed(2)}</strong></td></tr>
    `;
    const orderSummaryText = orderDetails.summary.map(item => `${item.name ?? 'N/A'} - Quantity: ${item.amount ?? 0}, Price: $${(item.price ?? 0).toFixed(2)}, Total: $${((item.amount ?? 0) * (item.price ?? 0)).toFixed(2)}`).join('\n');
    const expensesText = `
        Subtotal: $${orderDetails.expenses.total.toFixed(2)}
        Taxes: $${orderDetails.expenses.taxes.toFixed(2)}
        Delivery Fee: $${orderDetails.expenses.deliveryFee.toFixed(2)}
        Grand Total: $${orderDetails.expenses.grandTotal.toFixed(2)}
    `;
    return { invoiceDate, orderSummaryHtml, expensesHtml, orderSummaryText, expensesText };
}
// generic function to send emails using your MailOptions interface
async function _sendEmail(mailOptions) {
    const transporter = _createTransporter();
    try {
        await transporter.sendMail(mailOptions);
        loggerService.debug('Email sent successfully');
    }
    catch (error) {
        loggerService.error('Error sending email:', error);
        throw error;
    }
}
// utility function to create and return a transporter
function _createTransporter() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENDER_GMAIL_ADDRESS ?? '',
            pass: process.env.SENDER_GMAIL_PASSWORD ?? '',
        },
    });
}
