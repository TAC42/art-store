import { ObjectId } from 'mongodb'
import { Request, Response } from 'express'
import { ProductQueryParams } from '../../models/product.js'
import { productService } from './product.service.js'
import { loggerService } from '../../services/logger.service.js'

export async function getProducts(req: Request<{}, {}, {}, ProductQueryParams>, res: Response): Promise<void> {
  try {
    const { search, type } = req.query
    let filterBy = { search, type }

    loggerService.debug('Getting Products', filterBy)
    const products = await productService.query(filterBy)
    res.json(products)
  } catch (err) {
    loggerService.error('Failed to get products', err)
    res.status(500).send({ err: 'Failed to get products' })
  }
}

export async function getProductById(req: Request<{ id: ObjectId }>, res: Response): Promise<void> {
  try {
    const productId = req.params.id
    const product = await productService.getById(productId)

    if (!product) {
      loggerService.error('Product not found')
      res.status(404).send('Product not found')
      return
    }
    res.json(product)
  } catch (err) {
    loggerService.error('Failed to get product', err)
    res.status(500).send({ err: 'Failed to get product' })
  }
}

export async function getProductByName(req: Request<{ name: string }>, res: Response): Promise<void> {
  try {
    const productName = req.params.name
    const product = await productService.getByName(productName)

    if (!product) {
      loggerService.error('Product not found')
      res.status(404).send('Product not found')
      return
    }
    res.json(product)
  } catch (err) {
    loggerService.error('Failed to get product by name', err)
    res.status(500).send({ err: 'Failed to get product by name' })
  }
}

export async function checkNameAvailable(req: Request<{ name: string }>, res: Response): Promise<void> {
  try {
    const productName = req.params.name
    const product = await productService.getByName(productName)

    if (product) loggerService.error('Product name is not available', product.name)
    else loggerService.info('Product name is available', productName)

    res.json({ isNameAvailable: !product })
  } catch (err) {
    loggerService.error('Error with checking availability of name', err)
    res.status(500).send({ err: 'Error with checking availability of name' })
  }
}

export async function getRandomProducts(req: Request, res: Response): Promise<void> {
  try {
    const type = typeof req.query.type === 'string' ? req.query.type : undefined;

    let excludeProductId: ObjectId | undefined;
    if (typeof req.query.excludeProductId === 'string') {
      try {
        excludeProductId = new ObjectId(req.query.excludeProductId);
      } catch (error) {
        // If the string is not a valid ObjectId, log the error and optionally handle it
        loggerService.error('Invalid ObjectId for excludeProductId', error);
        excludeProductId = undefined; // Or handle the error as appropriate
      }
    }

    const products = await productService.getRandomProducts(type, excludeProductId);
    res.json(products);
  } catch (err) {
    loggerService.error('Failed to get random products', err);
    res.status(500).send({ err: 'Failed to get random products' });
  }
}

export async function addProduct(req: Request, res: Response): Promise<void> {
  try {
    const product = req.body
    loggerService.debug('Creating product: ', product)
    const addedProduct = await productService.save(product)

    res.json(addedProduct)
  } catch (err) {
    loggerService.error('Failed to add product', err)
    res.status(500).send({ err: 'Failed to add product' })
  }
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  try {
    const product = { ...req.body, _id: req.params.id }
    loggerService.debug('Updating product: ', product)
    const updatedProduct = await productService.save(product)

    res.json(updatedProduct)
  } catch (err) {
    loggerService.error('Failed to update product', err)
    res.status(500).send({ err: 'Failed to update product' })
  }
}

export async function removeProduct(req: Request<{ id: ObjectId }>, res: Response): Promise<void> {
  try {
    const productId = req.params.id
    await productService.remove(productId)

    res.send({ msg: 'Deleted successfully' })
  } catch (err) {
    loggerService.error('Failed to remove product', err)
    res.status(500).send({ err: 'Failed to remove product' })
  }
}

// import { productService } from './product.service.js'
// import { loggerService } from '../../services/logger.service.js'

// export async function getProducts(req, res) {
//   try {
//     const { search, type } = req.query
//     let filterBy = { search, type }

//     loggerService.debug('Getting Products', filterBy)
//     const products = await productService.query(filterBy)
//     res.json(products)

//   } catch (err) {
//     loggerService.error('Failed to get products', err)
//     res.status(500).send({ err: 'Failed to get products' })
//   }
// }

// export async function getProductById(req, res) {
//   try {
//     const productId = req.params.id
//     const product = await productService.getById(productId)

//     if (!product) {
//       loggerService.error('Product not found')
//       res.status(404).send('Product not found')
//     }
//     res.json(product)
//   } catch (err) {
//     loggerService.error('Failed to get product')
//     res.status(500).send('Failed to get product')
//   }
// }

// export async function getProductByName(req, res) {
//   try {
//     const productName = req.params.name
//     const product = await productService.getByName(productName)

//     if (!product) {
//       loggerService.error('Product not found')
//       res.status(404).send('Product not found')
//     }
//     res.json(product)
//   } catch (err) {
//     loggerService.error('Failed to get product by name', err)
//     res.status(500).send({ err: 'Failed to get product by name' })
//   }
// }

// export async function checkNameAvailable(req, res) {
//   try {
//     const productName = req.params.name
//     const product = await productService.getByName(productName)

//     if (product) loggerService.error('Product name is not availble', product.name)
//     else loggerService.info('Product name is availble', productName)

//     res.json({ isNameAvailable: !product })
//   } catch (err) {
//     loggerService.error('Error with checking availability of name', err)
//     res.status(500).send({ err: 'Error with checking availability of name' })
//   }
// }

// export async function getRandomProducts(req, res) {
//   try {
//     const { type, excludeProductId } = req.query
//     const products = await productService.getRandomProducts(type, excludeProductId)

//     res.json(products)
//   } catch (err) {
//     loggerService.error('Failed to get random products', err)
//     res.status(500).send({ err: 'Failed to get random products' })
//   }
// }

// export async function addProduct(req, res) {
//   try {
//     const product = req.body
//     console.log('creating product: ', product)
//     const addedProduct = await productService.save(product)

//     res.json(addedProduct)
//   } catch (err) {
//     loggerService.error('Failed to add product', err)
//     res.status(500).send({ err: 'Failed to add product' })
//   }
// }

// export async function updateProduct(req, res) {
//   try {
//     const product = req.body
//     console.log('updating product: ', product)
//     const updatedProduct = await productService.save(product)

//     res.send(updatedProduct)
//   } catch (err) {
//     loggerService.error('Failed to update product', err)
//     res.status(500).send({ err: 'Failed to update product' })
//   }
// }

// export async function removeProduct(req, res) {
//   try {
//     const productId = req.params.id
//     await productService.remove(productId)

//     res.send()
//   } catch (err) {
//     loggerService.error('Failed to remove product', err)
//     res.status(500).send({ err: 'Failed to remove product' })
//   }
// }