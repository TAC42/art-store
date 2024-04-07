import nodemailer from 'nodemailer';
import { loggerService } from '../../services/logger.service.js';
import { utilityService } from '../../services/utility.service.js';
export const mailService = {
    sendContactUsMail,
    sendVerificationMail,
    sendResetCodeMail,
    sendUserUpdatedMail,
    sendCustomerInvoice,
    sendArtistInvoice,
    sendOrderStatusMail
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
        If you did not request this, you may ignore this email.
        The account will be deleted within 24 hours, if left unverified.`,
        html: `
            <p>Dear ${username},</p>
            <p>In order to continue using our site, we'll need you to verify your account.</p>
            <p>Please use the following code to complete the process:</p>
            <p><b>${code}</b></p>
            <hr>
            <p>If you did not request this, you may ignore this email.</p>
            <p>The account will be deleted within 24 hours, if left unverified.</p>
            <p>Thank you,<br>The Ori Carlin Team</p>`,
    };
    await _sendEmail(mailOptions);
}
async function sendResetCodeMail(email, code) {
    loggerService.debug(`Sending reset code email containing: ${email}, ${code}`);
    const mailOptions = {
        from: process.env.SENDER_GMAIL_ADDRESS ?? '',
        to: email,
        subject: `Reset user at Ori-Carlin`,
        text: `Dear user, To proceed with reseting the password / email of your account,
        please copy the following code: ${code}.
        Do not give this code to anyone!
        If you did not request a user reset, please ignore this email or contact us through the site.`,
        html: `
            <p>Dear user,</p>
            <p>To proceed with reseting the password / email of your account, please copy the following code:</p>
            <p><b>${code}</b></p>
            <p>Do not give this code to anyone!</p>
            <hr>
            <p>If you did not request a user reset, please ignore this email or contact us through the site.</p>
            <p>Thank you,<br>The Ori Carlin Team</p>`,
    };
    await _sendEmail(mailOptions);
}
async function sendUserUpdatedMail(username, email) {
    loggerService.debug(`Sending user updated email containing: ${username}, ${email}`);
    const updateDate = utilityService.formatDate();
    const mailOptions = {
        from: process.env.SENDER_GMAIL_ADDRESS ?? '',
        to: email,
        subject: `Account Updated at Ori-Carlin`,
        text: `Dear ${username}, we noticed that your account's password / email has changed recently.
        The change happend at around ${updateDate} - US New York Time.
        We sent you this email to be sure, that you in fact made the changes.
        If you did not perform this action, do not hesitate and contact us ASAP!`,
        html: `
            <p>Dear ${username},</p>
            <p>We noticed that your account's password / email has changed recently.</p>
            <p>The change happend at around ${updateDate} - US New York Time.</p>
            <p>We sent you this email to be sure, that you in fact made the changes.</p>
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
        Further updates on the status of your order will be sent in the future.
        Invoice: #${orderDetails.createdAt}
        Date issued: ${invoiceDate}
        Purchased products:
        ${orderSummaryText}
        Expenses:
        ${expensesText}
        Payment method: ${orderDetails.payment}.
        For any questions regarding this order, please contact us through the site.
        Thank you, The Ori Carlin Team`,
        html: `
            <p>Hello ${orderDetails.user.firstName},</p>
            <p>Thank you for shopping with us.</p>
            <p>Further updates on the status of your order will be sent in the future.</p>
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
            <p>For any questions regarding this order, please contact us through the <a href="https://www.oricarlin.com">site</a>.</p>
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
async function sendOrderStatusMail(orderDetails) {
    loggerService.debug(`Sending update email on order #${orderDetails.createdAt} to ${orderDetails.user.email}`);
    const { orderUpdateText, orderUpdateHtml } = _FetchStatusContents(orderDetails);
    const mailOptions = {
        from: process.env.SENDER_GMAIL_ADDRESS ?? '',
        to: orderDetails.user.email,
        subject: `Ori Carlin Order #${orderDetails.createdAt} | Status - ${orderDetails.status}`,
        text: `Hello ${orderDetails.user.firstName},
        We'd like to update you in regards to the order #${orderDetails.createdAt}.
        ${orderUpdateText}
        Thank you, The Ori Carlin Team`,
        html: `
            <p>Hello ${orderDetails.user.firstName},</p>
            <p>We'd like to update you in regards to the order #${orderDetails.createdAt}.</p>
            <hr>
            ${orderUpdateHtml}
            <p>Thank you,<br>The Ori Carlin Team</p>`,
    };
    await _sendEmail(mailOptions);
}
function _FetchStatusContents(orderDetails) {
    let orderUpdateText = ``;
    let orderUpdateHtml = ``;
    switch (orderDetails.status) {
        case 'canceled':
            orderUpdateText = `
                Unfortunately, your order cannot be processed at this time. 
                Please contact our support team for further assistance.`;
            orderUpdateHtml = `
                <p>Unfortunately, your order cannot be processed at this time.</p>
                <p>Please contact our support team for further assistance.</p>`;
            break;
        case 'accepted':
            orderUpdateText = `
                Your order has been accepted and is now being processed. 
                Thank you for your patience!`;
            orderUpdateHtml = `
                <p>Your order has been accepted and is now being processed.</p>
                <p>Thank you for your patience!</p>`;
            break;
        case 'delivering':
            orderUpdateText = `
                Your order is on its way to you. 
                It is currently out for delivery and should reach you soon.`;
            orderUpdateHtml = `
                <p>Your order is on its way to you.</p>
                <p>It is currently out for delivery and should reach you soon.</p>`;
            break;
        case 'shipped':
            const ShippingDate = utilityService.formatDate();
            orderUpdateText = `
                Your order has been shipped on ${ShippingDate}.
                Please note, the reference number provided: ${orderDetails.createdAt}, is your order's number on the site.`;
            orderUpdateHtml = `
                <p>Your order has been shipped on ${ShippingDate}.</p>
                <p>Please note, the reference number provided: ${orderDetails.createdAt}, is your order's number on the site.</p>`;
            break;
        default:
            orderUpdateText = `
                There has been an update to your order status. 
                Please check your account for the latest information.`;
            orderUpdateHtml = `
                <p>There has been an update to your order status.</p>
                <p>Please check your account for the latest information.</p>`;
    }
    return { orderUpdateText, orderUpdateHtml };
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
        <tr>
            <td colspan="3">Subtotal</td>
            <td>$${orderDetails.expenses.total.toFixed(2)}</td>
        </tr>
        <tr>
            <td colspan="3">Taxes</td>
            <td>$${orderDetails.expenses.taxes.toFixed(2)}</td>
        </tr>
        <tr>
            <td colspan="3">Delivery Fee</td>
            <td>$${orderDetails.expenses.deliveryFee.toFixed(2)}</td>
        </tr>
        <tr>
            <td colspan="3"><strong>Grand Total</strong></td>
            <td><strong>$${orderDetails.expenses.grandTotal.toFixed(2)}</strong></td>
        </tr>
    `;
    const orderSummaryText = orderDetails.summary.map(item => `${item.name ?? 'N/A'} - Quantity: ${item.amount ?? 0},
        Price: $${(item.price ?? 0).toFixed(2)},
        Total: $${((item.amount ?? 0) * (item.price ?? 0)).toFixed(2)}`).join('\n');
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
