import express from 'express'
import { log } from '../../middlewares/logger.middleware.js'
import { getProducts, getProductById, getProductByName, addProduct, updateProduct, removeProduct } from './product.controller.js'

export const productRoutes = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

productRoutes.get('/', log, getProducts)
productRoutes.get('/:id', getProductById)
productRoutes.get('/:name', getProductByName)
productRoutes.post('/', addProduct)
productRoutes.put('/:id', updateProduct)
productRoutes.delete('/:id', removeProduct)