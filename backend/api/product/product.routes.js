import express from 'express'
import { log } from '../../middlewares/logger.middleware.js'
import {
    getProducts, getProductById, getProductByName, addProduct,
    updateProduct, removeProduct, getRandomProducts
} from './product.controller.js'

export const productRoutes = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

productRoutes.get('/', log, getProducts)
productRoutes.get('/random', getRandomProducts)
productRoutes.get('/:name', getProductByName)
productRoutes.get('/:id', getProductById)
productRoutes.post('/', addProduct)
productRoutes.put('/:id', updateProduct)
productRoutes.delete('/:id', removeProduct)