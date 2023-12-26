import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'
import { cloudinaryService } from '../../services/cloudinary.service.js'

const PRODUCTS_COLLECTION = 'product'

export const productService = {
  query,
  getById,
  remove,
  save,
}

async function query(filterBy = {}) {
  try {
    // const page = filterBy.page || 1
    // const itemsPerPage = 12
    // const skipCount = (page - 1) * itemsPerPage

    const pipeline = _buildPipeline(filterBy)
    // console.log('Filter Criteria:', criteria)
    const collection = await dbService.getCollection(PRODUCTS_COLLECTION)
    let products = await collection.aggregate(pipeline).toArray()

    return products
  } catch (err) {
    loggerService.error('cannot find products', err)
    throw err
  }
}

async function getById(productId) {
  try {
    const collection = await dbService.getCollection(PRODUCTS_COLLECTION)
    const product = await collection.findOne({ _id: new ObjectId(productId) })
    if (!product) {
      loggerService.error(`Product not found with id: ${productId}`)
      throw new Error(`Product not found with id: ${productId}`)
    }
    return product
  } catch (err) {
    loggerService.error(`while finding product ${productId}`, err)
    throw err
  }
}

async function remove(productId) {
  try {
    const collection = await dbService.getCollection(PRODUCTS_COLLECTION)
    const { deletedCount } = await collection.deleteOne({
      _id: new ObjectId(productId),
    })
    if (deletedCount === 0) {
      throw new Error(`Product with id ${productId} was not found`)
    }
    return deletedCount
  } catch (err) {
    loggerService.error(`cannot remove product ${productId}`, err)
    throw err
  }
}

async function save(product) {
  const collection = await dbService.getCollection(PRODUCTS_COLLECTION)

  try {
    const productToSave = { ...product }

    if (product._id) {
      const id = new ObjectId(product._id)
      delete productToSave._id

      _convertIdsToObjectIds(productToSave)

      const response = await collection.updateOne({ _id: id }, { $set: productToSave })
      if (response.matchedCount === 0) {
        throw new Error(`Product with id ${id.toHexString()} was not found`)
      }
      _checkRedundantProductImages()

      return { _id: id, ...productToSave }
    } else {
      _convertIdsToObjectIds(productToSave)

      const response = await collection.insertOne(productToSave)
      _checkRedundantProductImages()

      return { ...productToSave, _id: response.insertedId }
    }
  } catch (err) {
    loggerService.error(`cannot save product ${product._id}`, err)
    throw err
  }
}

function _convertIdsToObjectIds(productData) {
  const fieldsToConvert = ['ownerId', 'likedByUsers', 'reviews']
  fieldsToConvert.forEach(field => {
    if (Array.isArray(productData[field])) {
      productData[field] = productData[field].map(id => new ObjectId(id))
    } else if (productData[field] && typeof productData[field] === 'string') {
      productData[field] = new ObjectId(productData[field])
    }
  })
}

function _buildPipeline(filterBy) {
  const pipeline = []

  const criteria = {
    $match: {},
  }
  console.log('FILTERBY: ', filterBy)
  const { search, cat, level, min, max, tag, time } = filterBy

  if (search) {
    criteria.$match.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ]
  }

  if (cat) {
    criteria.$match.category = { $regex: cat, $options: 'i' }
  }

  criteria.$match.price = {}

  if (min) {
    criteria.$match.price.$gte = parseInt(min)
  } else criteria.$match.price.$gte = parseInt(0)

  if (max) {
    criteria.$match.price.$lte = parseInt(max)
  } else criteria.$match.price.$lte = parseInt(10000)

  if (tag) {
    criteria.$match.tags = { $regex: tag, $options: 'i' }
  }

  if (time) {
    criteria.$match.daysToMake = { $regex: time, $options: 'i' }
  }

  if (level) {
    pipeline.push({
      $lookup: {
        from: 'user',
        localField: 'ownerId',
        foreignField: '_id',
        as: 'userDetails',
      },
    })
    pipeline.push({
      $match: {
        'userDetails.level': { $regex: level, $options: 'i' },
      },
    })
  }

  if (Object.keys(criteria.$match).length > 0) {
    pipeline.push(criteria)
  }
  return pipeline
}

async function _checkRedundantProductImages() {
  try {
    const productImagePublicIds = await _getAllProductImages()
    const cloudinaryImagePublicIds = await cloudinaryService.getAllCloudinaryImages('product-images')

    const orphanedImages = cloudinaryImagePublicIds.filter
      (publicId => !productImagePublicIds.includes(publicId))

    if (orphanedImages.length === 0) {
      console.log('No orphaned images found')
    } else {
      console.log('Total orphaned images found: ', orphanedImages.length)
      for (const publicId of orphanedImages) {
        await cloudinaryService.deleteImageFromCloudinary(publicId)
      }
      console.log('Deletion of orphaned images completed, no more left')
    }
  } catch (err) {
    loggerService.error('Error checking for redundant images', err)
    throw err
  }
}

async function _getAllProductImages() {
  try {
    const collection = await dbService.getCollection(PRODUCTS_COLLECTION)
    const products = await collection.find({}, { projection: { imgUrl: 1 } }).toArray()
    // Extract public IDs from product image URL
    const productImagePublicIds = products.map(product =>
      cloudinaryService.extractPublicIdFromUrl(product.imgUrl)
    )
    return productImagePublicIds
  } catch (err) {
    loggerService.error('Failed to get product image', err)
    throw err
  }
}