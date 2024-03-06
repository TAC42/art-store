import { ObjectId } from "mongodb"
import { Product, ProductQueryParams, MatchCriteria } from "../../models/product.js"
import { dbService } from "../../services/db.service.js"
import { loggerService } from "../../services/logger.service.js"
import { cloudinaryService } from "../../services/cloudinary.service.js"

const PRODUCTS_COLLECTION = 'product'

export const productService = {
  query,
  getById,
  getByName,
  save,
  remove,
  getRandomProducts,
  checkRedundantProductImages,
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
    const products = await collection.find<Product>(
      { name: { $regex: new RegExp(productName, 'i') } }).toArray()
    const product = products.length > 0 ? products[0] : null

    if (product) loggerService.info('found product: ', product)
    else loggerService.error('No product found with name:', productName)

    return product
  } catch (err) {
    loggerService.error(`Error finding product ${productName}`, err)
    throw err
  }
}

async function getRandomProducts(type?: string, excludeProductId?: ObjectId): Promise<Product[]> {
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
  try {
    const collection = await dbService.getCollection(PRODUCTS_COLLECTION)

    if (product._id) {
      const id = new ObjectId(product._id.toString())
      const productToUpdate = { ...product, _id: undefined }

      const result = await collection.updateOne({ _id: id }, { $set: productToUpdate })
      if (result.matchedCount === 0) throw new Error(`Product with id ${id} not found`)

      return { ...productToUpdate, _id: id }
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

async function checkRedundantProductImages(): Promise<void> {
  try {
    const folders = ['Shop', 'Artware', 'Sculpture']
    const cloudinaryImagePublicIds = await cloudinaryService.getAllCloudinaryImages(folders)

    const productImagePublicIds = await _getAllProductImages()
    const orphanedImages = cloudinaryImagePublicIds.filter(
      (publicId) => !productImagePublicIds.includes(publicId))

    if (orphanedImages.length > 0) {
      loggerService.info('Orphaned images found: ', orphanedImages)
      loggerService.info('Total amount found: ', orphanedImages.length)

      for (const publicId of orphanedImages) {
        await cloudinaryService.deleteImageFromCloudinary(publicId)
      }
      loggerService.debug('Deletion of orphaned images completed')
    } else loggerService.info('No orphaned images found')
  } catch (err) {
    loggerService.error('Error checking for redundant images', err)
    throw err
  }
}

async function _getAllProductImages(): Promise<string[]> {
  try {
    const collection = await dbService.getCollection(PRODUCTS_COLLECTION)
    const products = await collection.find({}, { projection: { imgUrls: 1 } }).toArray()

    const imgUrls = products.reduce((acc: string[], product) => {
      if (product.imgUrls) acc.push(...product.imgUrls)
      return acc
    }, [])

    const resultImagePublicIds = imgUrls.map(
      imgUrl => cloudinaryService.extractPublicIdFromUrl(imgUrl)
    ).filter((id): id is string => id !== null)

    return resultImagePublicIds
  } catch (err) {
    loggerService.error('Failed to get product images', err)
    throw err
  }
}

// import mongodb from 'mongodb'
// const { ObjectId } = mongodb

// import { dbService } from '../../services/db.service.js'
// import { loggerService } from '../../services/logger.service.js'
// import { cloudinaryService } from '../../services/cloudinary.service.js'

// const PRODUCTS_COLLECTION = 'product'

// export const productService = {
//   query,
//   getById,
//   getByName,
//   save,
//   remove,
//   getRandomProducts,
//   checkRedundantProductImages,
// }

// async function query(filterBy = {}) {
//   try {
//     const pipeline = _buildPipeline(filterBy)

//     const collection = await dbService.getCollection(PRODUCTS_COLLECTION)
//     let products = await collection.aggregate(pipeline).toArray()

//     return products
//   } catch (err) {
//     loggerService.error('cannot find products', err)
//     throw err
//   }
// }

// async function getById(productId) {
//   try {
//     const collection = await dbService.getCollection(PRODUCTS_COLLECTION)
//     const product = await collection.findOne({ _id: new ObjectId(productId) })

//     return product || null
//   } catch (err) {
//     loggerService.error(`while finding product ${productId}`, err)
//     throw err
//   }
// }

// async function getByName(productName) {
//   try {
//     const filterBy = { search: productName }
//     const products = await query(filterBy)
//     const product = products.find((p) => p.name.toLowerCase() ===
//       productName.toLowerCase())

//     if (product) loggerService.info('found product: ', product)
//     else loggerService.error('no found product')

//     return product || null
//   } catch (err) {
//     loggerService.error(`while finding product with name ${productName}`, err)
//     throw err
//   }
// }

// async function getRandomProducts(type, excludeProductId) {
//   try {
//     const pipeline = [
//       { $match: { _id: { $ne: new ObjectId(excludeProductId) }, type: type } },
//       { $sample: { size: 3 } }
//     ]
//     const collection = await dbService.getCollection(PRODUCTS_COLLECTION)
//     let products = await collection.aggregate(pipeline).toArray()

//     return products
//   } catch (err) {
//     loggerService.error('Error getting random products', err)
//     throw err
//   }
// }

// async function remove(productId) {
//   try {
//     const collection = await dbService.getCollection(PRODUCTS_COLLECTION)
//     const { deletedCount } = await collection.deleteOne({
//       _id: new ObjectId(productId),
//     })
//     console.log('DELETED COUNT IN REMOVE', deletedCount)
//     if (deletedCount === 0) {
//       throw new Error(`Product with id ${productId} was not found`)
//     }
//     return deletedCount
//   } catch (err) {
//     loggerService.error(`cannot remove product ${productId}`, err)
//     throw err
//   }
// }

// async function save(product) {
//   const collection = await dbService.getCollection(PRODUCTS_COLLECTION)

//   try {
//     const productToSave = { ...product }

//     if (product._id) {
//       const id = new ObjectId(product._id)
//       delete productToSave._id

//       const response = await collection.updateOne(
//         { _id: id },
//         { $set: productToSave }
//       )
//       if (response.matchedCount === 0) throw new Error(`Id ${id.toHexString()} not found`)

//       return { _id: id, ...productToSave }
//     } else {
//       const response = await collection.insertOne(productToSave)

//       return { ...productToSave, _id: response.insertedId }
//     }
//   } catch (err) {
//     loggerService.error(`cannot save product ${product._id}`, err)
//     throw err
//   }
// }

// function _buildPipeline(filterBy) {
//   const pipeline = []

//   const criteria = {
//     $match: {},
//   }
//   const { search, type } = filterBy

//   if (search) criteria.$match.$or = [
//     { name: { $regex: search, $options: 'i' } },
//     { description: { $regex: search, $options: 'i' } }]

//   if (type) criteria.$match.type = { $regex: type, $options: 'i' }

//   if (Object.keys(criteria.$match).length > 0) pipeline.push(criteria)

//   return pipeline
// }

// async function checkRedundantProductImages() {
//   try {
//     // fetch all images relevant to product folders from cloudinary
//     const folders = ['Shop', 'Artware', 'Sculpture']
//     const cloudinaryImagePublicIds = await cloudinaryService.getAllCloudinaryImages(folders)
//     // loggerService.info('Found cloud img ids: ', cloudinaryImagePublicIds)

//     // seperate between orphaned images and those who do belong to a product
//     const productImagePublicIds = await _getAllProductImages()
//     const orphanedImages = cloudinaryImagePublicIds.filter(
//       (publicId) => !productImagePublicIds.includes(publicId))

//     if (orphanedImages.length > 0) {
//       loggerService.info('Orphaned images found: ', orphanedImages)
//       loggerService.info('Total amount found: ', orphanedImages.length)

//       for (const publicId of orphanedImages) {
//         await cloudinaryService.deleteImageFromCloudinary(publicId)
//       }
//       loggerService.debug('Deletion of orphaned images completed')
//     } else loggerService.info('No orphaned images found')

//   } catch (err) {
//     loggerService.error('Error checking for redundant images', err)
//     throw err
//   }
// }

// async function _getAllProductImages() {
//   try {
//     const collection = await dbService.getCollection(PRODUCTS_COLLECTION)
//     const products = await collection.find(
//       {}, { projection: { imgUrls: 1 } }).toArray()

//     // Flatten the array of imgUrls arrays into a single array of URLs
//     const imgUrls = products.reduce((acc, product) => {
//       if (product.imgUrls && product.imgUrls.length) {
//         acc = acc.concat(product.imgUrls)
//       }
//       return acc
//     }, [])
//     // Extract public IDs from each URL in the flattened array
//     const resultImagePublicIds = imgUrls.map((imgUrl) =>
//       cloudinaryService.extractPublicIdFromUrl(imgUrl))

//     return resultImagePublicIds
//   } catch (err) {
//     loggerService.error('Failed to get product images', err)
//     throw err
//   }
// }