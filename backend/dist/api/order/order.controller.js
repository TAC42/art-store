import express from 'express';
import { orderService } from './order.service.js';
import { loggerService } from '../../services/logger.service.js';
import paypal from '@paypal/checkout-server-sdk';
// order routes
export const orderRoutes = express.Router();
orderRoutes.get('/', _getOrders);
orderRoutes.get('/:id', _getOrderById);
orderRoutes.post('/', _addOrder);
orderRoutes.put('/:id', _updateOrder);
orderRoutes.delete('/:id', _removeOrder);
orderRoutes.post('/paypal-order', _createPaypalOrder);
// order controller functions
async function _getOrders(req, res) {
    try {
        const { _id } = req.query;
        let filterBy = { _id };
        loggerService.debug('Getting Orders for user id:', filterBy);
        const orders = await orderService.query(filterBy);
        res.json(orders);
    }
    catch (err) {
        loggerService.error('Failed to get orders', err);
        res.status(500).send({ err: 'Failed to get orders' });
    }
}
async function _getOrderById(req, res) {
    try {
        const orderId = req.params.id;
        const order = await orderService.getById(orderId);
        if (!order) {
            loggerService.error('Order not found for id:', orderId);
            res.status(404).send('Order not found');
            return;
        }
        res.json(order);
    }
    catch (err) {
        loggerService.error(`Failed to get order for id: ${req.params.id}`, err);
        res.status(500).send({ err: 'Failed to get order' });
    }
}
async function _addOrder(req, res) {
    try {
        const order = req.body;
        loggerService.debug('Creating order:', order);
        const addedOrder = await orderService.save(order);
        res.json(addedOrder);
    }
    catch (err) {
        loggerService.error('Failed to add order', err);
        res.status(500).send({ err: 'Failed to add order' });
    }
}
async function _updateOrder(req, res) {
    try {
        const order = { ...req.body, _id: req.params.id };
        loggerService.debug('Updating order:', order._id);
        const updatedOrder = await orderService.save(order);
        res.json(updatedOrder);
    }
    catch (err) {
        loggerService.error('Failed to update order', err);
        res.status(500).send({ err: 'Failed to update order' });
    }
}
async function _removeOrder(req, res) {
    try {
        const orderId = req.params.id;
        loggerService.debug('Removing order with _id: ', orderId);
        await orderService.remove(orderId);
        res.status(200).send({ msg: 'Order successfully removed' });
    }
    catch (err) {
        loggerService.error('Failed to remove order', err);
        res.status(500).send({ err: 'Failed to remove order' });
    }
}
async function _createPaypalOrder(req, res) {
    try {
        const order = req.body;
        const paypalOrderId = await createPaypalOrder(order);
        if (!paypalOrderId) {
            loggerService.error('PayPal order creation failed');
            res.status(500).send({ err: 'Failed to create PayPal order' });
            return;
        }
        // Return the PayPal order ID to the client
        res.json({ paypalOrderId });
    }
    catch (err) {
        loggerService.error('Failed to create PayPal order', err);
        res.status(500).send({ err: 'Failed to create PayPal order' });
    }
}
async function createPaypalOrder(order) {
    try {
        if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
            throw new Error('PayPal client ID or secret is not defined.');
        }
        const environment = process.env.NODE_ENV === 'production'
            ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
            : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
        const client = new paypal.core.PayPalHttpClient(environment);
        const totalPrice = order.expenses.grandTotal;
        const taxAmount = order.expenses.taxes;
        const deliveryFee = order.expenses.deliveryFee;
        const total = order.expenses.total;
        // Create order request
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: totalPrice.toFixed(2),
                        breakdown: {
                            item_total: {
                                currency_code: "USD",
                                value: total.toFixed(2),
                            },
                            tax_total: {
                                currency_code: "USD",
                                value: taxAmount.toFixed(2),
                            },
                            shipping: {
                                currency_code: "USD",
                                value: deliveryFee.toFixed(2),
                            },
                            // Provide defaults for other breakdown properties
                            discount: { currency_code: "USD", value: "0.00" },
                            handling: { currency_code: "USD", value: "0.00" },
                            insurance: { currency_code: "USD", value: "0.00" },
                            shipping_discount: { currency_code: "USD", value: "0.00" },
                        },
                    },
                    items: order.summary.map(item => ({
                        name: item.name ?? '',
                        unit_amount: {
                            currency_code: "USD",
                            value: item.price?.toFixed(2) ?? '0.00',
                        },
                        quantity: item.amount?.toString() ?? '1',
                        category: 'PHYSICAL_GOODS',
                    })),
                },
            ],
        });
        console.log('THE ORDER REQUEST PAYPAL: ', request);
        console.log('THE ORDER REQUEST PAYPAL: ', JSON.stringify(request.body.purchase_units));
        // Execute PayPal request
        const response = await client.execute(request);
        console.log('THE RESPONSE PAYPAL: ', response.result.id);
        loggerService.debug('THE RESPONSE PAYPAL:', response);
        return response.result.id;
    }
    catch (err) {
        loggerService.error('Failed to create PayPal order', err);
        return undefined;
    }
}
