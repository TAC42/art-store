import { ObjectId } from "mongodb"
import { Product, ProductQueryParams, MatchCriteria } from "../../models/product.js"
import { dbService } from "../../services/db.service.js"
import { loggerService } from "../../services/logger.service.js"

const PRODUCTS_COLLECTION = 'product'

export const productService = {
  query,
  getById,
  getByName,
  save,
  remove,
  getRandomProducts
}

async function query(filterBy: ProductQueryParams = {}): Promise<Product[]> {
  try {
    const collection = await dbService.getCollection(PRODUCTS_COLLECTION)
    const pipeline = _buildPipeline(filterBy)

    return await collection.aggregate<Product>(pipeline).toArray()
  } catch (err) {
    loggerService.error('cannot find products', err)
    throw err
  }
}

async function getById(productId: ObjectId): Promise<Product | null> {
  try {
    const collection = await dbService.getCollection(PRODUCTS_COLLECTION)

    const product = await collection.findOne<Product>(
      { _id: new ObjectId(productId) })
    return product
  } catch (err) {
    loggerService.error(`Error finding product ${productId}`, err)
    throw err
  }
}

async function getByName(productName: string): Promise<Product | null> {
  try {
    const collection = await dbService.getCollection(PRODUCTS_COLLECTION)

    const product = await collection.findOne<Product>(
      { name: { $regex: `^${productName}$`, $options: 'i' } })

    if (product) loggerService.info('found product: ', product._id)
    else loggerService.error('No product found with name:', productName)

    return product
  } catch (err) {
    loggerService.error(`Error finding product ${productName}`, err)
    throw err
  }
}

async function getRandomProducts(type: string, excludeProductId?: ObjectId): Promise<Product[]> {
  try {
    const collection = await dbService.getCollection(PRODUCTS_COLLECTION)
    const pipeline = [
      { $match: { _id: { $ne: new ObjectId(excludeProductId) }, type } },
      { $sample: { size: 3 } }
    ]
    return await collection.aggregate<Product>(pipeline).toArray()
  } catch (err) {
    loggerService.error('Error getting random products', err)
    throw err
  }
}

async function save(product: Product): Promise<Product> {
  const collection = await dbService.getCollection(PRODUCTS_COLLECTION)

  try {
    if (product._id) {
      const { _id, ...productToUpdate } = product
      const id = _id instanceof ObjectId ? _id : new ObjectId(_id)

      const result = await collection.updateOne(
        { _id: id }, { $set: productToUpdate })

      if (result.matchedCount === 0) throw new Error(`Product with id ${id.toHexString()} not found`)

      return product
    } else {
      const response = await collection.insertOne(product)
      return { ...product, _id: response.insertedId }
    }
  } catch (err) {
    loggerService.error('Failed to save product', err)
    throw err
  }
}

async function remove(productId: ObjectId): Promise<number> {
  try {
    const collection = await dbService.getCollection(PRODUCTS_COLLECTION)
    const { deletedCount } = await collection.deleteOne(
      { _id: new ObjectId(productId) })

    if (deletedCount === 0) throw new Error(`Product with id ${productId} was not found`)

    return deletedCount
  } catch (err) {
    loggerService.error(`cannot remove product ${productId}`, err)
    throw err
  }
}

function _buildPipeline(filterBy: ProductQueryParams): object[] {
  const pipeline: object[] = []

  const criteria: MatchCriteria = { $match: {} }

  if (filterBy.search) {
    criteria.$match.$or = [
      { name: { $regex: new RegExp(filterBy.search, 'i') } },
      { description: { $regex: new RegExp(filterBy.search, 'i') } }
    ]
  }

  if (filterBy.type) {
    criteria.$match.type = { $regex: new RegExp(filterBy.type, 'i') }
  }

  pipeline.push(criteria)
  return pipeline
}