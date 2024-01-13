import { productService } from './product.service.js'
import { loggerService } from '../../services/logger.service.js'

export async function getProducts(req, res) {
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

export async function getProductById(req, res) {
  try {
    const productId = req.params.id
    const product = await productService.getById(productId)

    res.json(product)
  } catch (err) {
    loggerService.error('Failed to get product', err)
    res.status(500).send({ err: 'Failed to get product' })
  }
}

export async function getProductByName(req, res) {
  try {
    const productName = req.params.name
    const product = await productService.getByName(productName)

    res.json(product)
  } catch (err) {
    loggerService.error('Failed to get product by name', err)
    res.status(500).send({ err: 'Failed to get product by name' })
  }
}

export async function getRandomProducts(req, res) {
  try {
    const { type, excludeProductId } = req.query
    const products = await productService.getRandomProducts(type, excludeProductId)

    res.json(products)
  } catch (err) {
    loggerService.error('Failed to get random products', err)
    res.status(500).send({ err: 'Failed to get random products' })
  }
}

export async function addProduct(req, res) {
  try {
    const product = req.body
    console.log('creating product: ', product)
    const addedProduct = await productService.save(product)

    res.json(addedProduct)
  } catch (err) {
    loggerService.error('Failed to add product', err)
    res.status(500).send({ err: 'Failed to add product' })
  }
}

export async function updateProduct(req, res) {
  try {
    const product = req.body
    console.log('updating product: ', product)
    const updatedProduct = await productService.save(product)

    res.send(updatedProduct)
  } catch (err) {
    loggerService.error('Failed to update product', err)
    res.status(500).send({ err: 'Failed to update product' })
  }
}

export async function removeProduct(req, res) {
  try {
    const productId = req.params.id
    await productService.remove(productId)

    res.send()
  } catch (err) {
    loggerService.error('Failed to remove product', err)
    res.status(500).send({ err: 'Failed to remove product' })
  }
}
