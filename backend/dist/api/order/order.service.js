import { ObjectId } from 'mongodb';
import { dbService } from '../../services/db.service.js';
import { loggerService } from '../../services/logger.service.js';
const ORDERS_COLLECTION = 'order';
export const orderService = {
    query,
    getById,
    remove,
    save,
};
async function query(filterBy = {}) {
    try {
        const pipeline = _buildPipeline(filterBy);
        const collection = await dbService.getCollection(ORDERS_COLLECTION);
        let orders = await collection.aggregate(pipeline).toArray();
        return orders;
    }
    catch (err) {
        loggerService.error('cannot find orders', err);
        throw err;
    }
}
async function getById(orderId) {
    try {
        const collection = await dbService.getCollection(ORDERS_COLLECTION);
        const order = await collection.findOne({ _id: new ObjectId(orderId) });
        loggerService.debug('found order: ', order);
        return order || null;
    }
    catch (err) {
        loggerService.error(`while finding order ${orderId}`, err);
        throw err;
    }
}
async function remove(orderId) {
    try {
        const collection = await dbService.getCollection(ORDERS_COLLECTION);
        const { deletedCount } = await collection.deleteOne({
            _id: new ObjectId(orderId)
        });
        if (deletedCount === 0)
            throw new Error(`Order with id ${orderId} was not found`);
        return deletedCount;
    }
    catch (err) {
        loggerService.error(`cannot remove order ${orderId}`, err);
        throw err;
    }
}
async function save(order) {
    try {
        const collection = await dbService.getCollection(ORDERS_COLLECTION);
        if (order._id) {
            const id = new ObjectId(order._id);
            const result = await collection.updateOne({ _id: id }, { $set: { ...order, _id: undefined } });
            if (result.matchedCount === 0)
                throw new Error(`Order ${order._id} was not found`);
            return { ...order, _id: id };
        }
        else {
            if (typeof order.user._id === 'string')
                order.user._id = new ObjectId(order.user._id);
            const result = await collection.insertOne({ ...order, _id: undefined });
            return { ...order, _id: result.insertedId };
        }
    }
    catch (err) {
        loggerService.error('Failed to save the order', err);
        throw err;
    }
}
function _buildPipeline(filterBy) {
    const pipeline = [];
    const { _id } = filterBy;
    const criteria = { $match: {} };
    if (_id) {
        criteria.$match.$or = [{ 'user._id': new ObjectId(_id) }];
    }
    if (Object.keys(criteria.$match).length > 0) {
        pipeline.push(criteria);
    }
    return pipeline;
}
