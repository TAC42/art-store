import express, { Router } from 'express'
import { log } from '../../middlewares/logger.middleware.js'
import {
    getProducts, getProductById, getProductByName, addProduct,
    updateProduct, removeProduct, getRandomProducts, checkNameAvailable
} from './product.controller.js'

export const productRoutes: Router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

productRoutes.get('/', log, getProducts)
productRoutes.get('/query/random', getRandomProducts)
productRoutes.get('/check-name/:name', checkNameAvailable)
productRoutes.get('/by-name/:name', getProductByName)
productRoutes.get('/by-id/:id', getProductById)
productRoutes.post('/add/', addProduct)
productRoutes.put('/update/:id', updateProduct)
productRoutes.delete('/delete/:id', removeProduct)