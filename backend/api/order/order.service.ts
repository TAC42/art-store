import { ObjectId, WithId, Document } from 'mongodb'
import { Order, FilterBy, MatchCriteria } from '../../models/order.js'
import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'

const ORDERS_COLLECTION = 'order'

export const orderService = {
  query,
  getById,
  remove,
  save,
}

async function query(filterBy: FilterBy = {}): Promise<WithId<Document>[]> {
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

async function getById(orderId: string): Promise<Order | null> {
  try {
    const collection = await dbService.getCollection(ORDERS_COLLECTION)
    const order = await collection.findOne<Order>(
      { _id: new ObjectId(orderId) })
    loggerService.debug('found order: ', order)

    return order || null
  } catch (err) {
    loggerService.error(`while finding order ${orderId}`, err)
    throw err
  }
}

async function remove(orderId: string): Promise<number> {
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

async function save(order: Order): Promise<Order> {
  try {
    const collection = await dbService.getCollection(ORDERS_COLLECTION)

    if (order._id) {
      const id = new ObjectId(order._id)
      const result = await collection.updateOne(
        { _id: id }, { $set: { ...order, _id: undefined } })

      if (result.matchedCount === 0) throw new Error(`Order ${order._id} was not found`)

      return { ...order, _id: id }
    } else {
      if (typeof order.user._id === 'string') order.user._id = new ObjectId(order.user._id)

      const result = await collection.insertOne({ ...order, _id: undefined })

      return { ...order, _id: result.insertedId }
    }
  } catch (err) {
    loggerService.error('Failed to save the order', err)
    throw err
  }
}

function _buildPipeline(filterBy: FilterBy): object[] {
  const pipeline: object[] = []

  const { id } = filterBy
  const criteria: MatchCriteria = { $match: {} }

  if (id) {
    criteria.$match.$or = [{ 'user._id': new ObjectId(id) }]
  }

  if (Object.keys(criteria.$match).length > 0) {
    pipeline.push(criteria)
  }
  console.log('this is the pipe: ', pipeline)

  return pipeline
}

// import mongodb from 'mongodb'
// const { ObjectId } = mongodb

// import { dbService } from '../../services/db.service.js'
// import { loggerService } from '../../services/logger.service.js'

// const ORDERS_COLLECTION = 'order'

// export const orderService = {
//   query,
//   getById,
//   remove,
//   save,
// }

// async function query(filterBy = {}) {
//   try {
//     const pipeline = _buildPipeline(filterBy)

//     const collection = await dbService.getCollection(ORDERS_COLLECTION)
//     let orders = await collection.aggregate(pipeline).toArray()

//     return orders
//   } catch (err) {
//     loggerService.error('cannot find orders', err)
//     throw err
//   }
// }

// async function getById(orderId) {
//   try {
//     const collection = await dbService.getCollection(ORDERS_COLLECTION)
//     const order = await collection.findOne({ _id: new ObjectId(orderId) })
//     console.log('found order: ', order)

//     return order || null
//   } catch (err) {
//     loggerService.error(`while finding order ${orderId}`, err)
//     throw err
//   }
// }

// async function remove(orderId) {
//   try {
//     const collection = await dbService.getCollection(ORDERS_COLLECTION)
//     const { deletedCount } = await collection.deleteOne({
//       _id: new ObjectId(orderId),
//     })
//     console.log('DELETED COUNT IN REMOVE', deletedCount)
//     if (deletedCount === 0) {
//       throw new Error(`Order with id ${orderId} was not found`)
//     }
//     return deletedCount
//   } catch (err) {
//     loggerService.error(`cannot remove order ${orderId}`, err)
//     throw err
//   }
// }

// async function save(order) {
//   const collection = await dbService.getCollection(ORDERS_COLLECTION)

//   try {
//     const orderToSave = { ...order }

//     if (order._id) {
//       const id = new ObjectId(order._id)
//       delete orderToSave._id

//       const response = await collection.updateOne(
//         { _id: id },
//         { $set: orderToSave }
//       )
//       if (response.matchedCount === 0) {
//         throw new Error(`Order with id ${id.toHexString()} was not found`)
//       }

//       return { _id: id, ...orderToSave }
//     } else {
//       const response = await collection.insertOne(orderToSave)

//       return { ...orderToSave, _id: response.insertedId }
//     }
//   } catch (err) {
//     loggerService.error(`cannot save order ${order._id}`, err)
//     throw err
//   }
// }

// function _buildPipeline(filterBy) {
//   const pipeline = []

//   const criteria = {
//     $match: {},
//   }

//   const { id } = filterBy

//   if (id) {
//     criteria.$match.$or = [
//       { 'user._id': id },
//     ]
//   }

//   if (Object.keys(criteria.$match).length > 0) {
//     pipeline.push(criteria)
//   }

//   return pipeline
// }