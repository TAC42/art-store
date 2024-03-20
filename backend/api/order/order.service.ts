import { ObjectId, WithId, Document } from 'mongodb'
import { Order, OrderQueryParams, MatchCriteria } from '../../models/order.js'
import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'

const ORDERS_COLLECTION = 'order'

export const orderService = {
  query,
  getById,
  remove,
  save,
}

async function query(filterBy: OrderQueryParams = {}): Promise<WithId<Document>[]> {
  try {
    const pipeline = _buildPipeline(filterBy)

    const collection = await dbService.getCollection(ORDERS_COLLECTION)
    let orders = await collection.aggregate<WithId<Document>>(pipeline).toArray()

    return orders
  } catch (err) {
    loggerService.error('cannot find orders', err)
    throw err
  }
}

async function getById(orderId: ObjectId): Promise<Order | null> {
  try {
    const collection = await dbService.getCollection(ORDERS_COLLECTION)
    const order = await collection.findOne<Order>(
      { _id: new ObjectId(orderId) })
    loggerService.info(`Found order relevant to ${orderId}: ${order}`)

    return order
  } catch (err) {
    loggerService.error(`while finding order ${orderId}`, err)
    throw err
  }
}

async function save(order: Order): Promise<Order> {
  const collection = await dbService.getCollection(ORDERS_COLLECTION)

  try {
    if (order.user && typeof order.user._id === 'string') {
      order.user._id = new ObjectId(order.user._id)
    }
    if (order.summary && Array.isArray(order.summary)) {
      order.summary = order.summary.map(product => ({
        ...product,
        _id: typeof product._id === 'string' ?
          new ObjectId(product._id) : product._id
      }))
    }

    if (order._id) {
      const id = typeof order._id === 'string' ?
        new ObjectId(order._id) : order._id
      const { _id, ...orderToUpdate } = order

      const result = await collection.updateOne(
        { _id: id }, { $set: orderToUpdate })

      if (result.matchedCount === 0) throw new Error(`Order with id ${id.toHexString()} not found`)

      return { ...orderToUpdate, _id: id }
    } else {
      const result = await collection.insertOne(order)
      return { ...order, _id: result.insertedId }
    }
  } catch (err) {
    loggerService.error('Failed to save the order', err)
    throw err
  }
}

async function remove(orderId: ObjectId): Promise<number> {
  try {
    const collection = await dbService.getCollection(ORDERS_COLLECTION)
    const { deletedCount } = await collection.deleteOne({
      _id: new ObjectId(orderId)
    })

    if (deletedCount === 0) throw new Error(`Order with id ${orderId} was not found`)

    return deletedCount
  } catch (err) {
    loggerService.error(`cannot remove order ${orderId}`, err)
    throw err
  }
}

function _buildPipeline(filterBy: OrderQueryParams): object[] {
  const pipeline: object[] = []

  const { _id } = filterBy
  const criteria: MatchCriteria = { $match: {} }

  if (_id) {
    criteria.$match.$or = [{ 'user._id': new ObjectId(_id) }]
  }

  if (Object.keys(criteria.$match).length > 0) {
    pipeline.push(criteria)
  }

  return pipeline
}