import { orderService } from './order.service.js';
import { loggerService } from '../../services/logger.service.js';
export async function getOrders(req, res) {
    try {
        const { _id } = req.query;
        let filterBy = { _id };
        loggerService.debug('Getting Orders for id:', filterBy);
        const orders = await orderService.query(filterBy);
        res.json(orders);
    }
    catch (err) {
        loggerService.error('Failed to get orders', err);
        res.status(500).send({ err: 'Failed to get orders' });
    }
}
export async function getOrderById(req, res) {
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
export async function addOrder(req, res) {
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
export async function updateOrder(req, res) {
    try {
        const order = req.body;
        loggerService.debug('Updating order:', order);
        const updatedOrder = await orderService.save(order);
        res.json(updatedOrder);
    }
    catch (err) {
        loggerService.error('Failed to update order', err);
        res.status(500).send({ err: 'Failed to update order' });
    }
}
export async function removeOrder(req, res) {
    try {
        const orderId = req.params.id;
        await orderService.remove(orderId);
        res.send({ msg: 'Deleted successfully' });
    }
    catch (err) {
        loggerService.error('Failed to remove order', err);
        res.status(500).send({ err: 'Failed to remove order' });
    }
}
