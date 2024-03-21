import express, { Router, Request, Response } from 'express'
import { Order } from '../../models/order.js'
import { orderService } from './order.service.js'
import { loggerService } from '../../services/logger.service.js'
import { ObjectId } from 'mongodb'

// order routes
export const orderRoutes: Router = express.Router()

orderRoutes.get('/', _getOrders)
orderRoutes.get('/:id', _getOrderById)
orderRoutes.post('/', _addOrder)
orderRoutes.put('/:id', _updateOrder)
orderRoutes.delete('/:id', _removeOrder)

// order controller functions
async function _getOrders(req: Request<{}, {}, {}, { _id?: ObjectId }>,
    res: Response): Promise<void> {
    try {
        const { _id } = req.query
        let filterBy = { _id }

        loggerService.debug('Getting Orders for user id:', filterBy)
        const orders = await orderService.query(filterBy)
        res.json(orders)
    } catch (err) {
        loggerService.error('Failed to get orders', err)
        res.status(500).send({ err: 'Failed to get orders' })
    }
}

async function _getOrderById(req: Request<{ id: ObjectId }>,
    res: Response): Promise<void> {
    try {
        const orderId = req.params.id
        const order = await orderService.getById(orderId)

        if (!order) {
            loggerService.error('Order not found for id:', orderId)
            res.status(404).send('Order not found')
            return
        }
        res.json(order)
    } catch (err) {
        loggerService.error(`Failed to get order for id: ${req.params.id}`, err)
        res.status(500).send({ err: 'Failed to get order' })
    }
}

async function _addOrder(req: Request<{}, {}, Order>,
    res: Response): Promise<void> {
    try {
        const order = req.body
        loggerService.debug('Creating order:', order)
        const addedOrder = await orderService.save(order)

        res.json(addedOrder)
    } catch (err) {
        loggerService.error('Failed to add order', err)
        res.status(500).send({ err: 'Failed to add order' })
    }
}

async function _updateOrder(req: Request<{ id: ObjectId }, {}, Order>,
    res: Response): Promise<void> {
    try {
        const order = { ...req.body, _id: req.params.id }
        loggerService.debug('Updating order:', order._id)
        const updatedOrder = await orderService.save(order)

        res.json(updatedOrder)
    } catch (err) {
        loggerService.error('Failed to update order', err)
        res.status(500).send({ err: 'Failed to update order' })
    }
}

async function _removeOrder(req: Request<{ id: ObjectId }>,
    res: Response): Promise<void> {
    try {
        const orderId = req.params.id
        loggerService.debug('Removing order with _id: ', orderId)
        await orderService.remove(orderId)

        res.status(200).send({ msg: 'Order successfully removed' })
    } catch (err) {
        loggerService.error('Failed to remove order', err)
        res.status(500).send({ err: 'Failed to remove order' })
    }
}