import express from 'express';
import { ObjectId } from 'mongodb';
import { productService } from './product.service.js';
import { loggerService } from '../../services/logger.service.js';
// product routes
export const productRoutes = express.Router();
// middleware that is specific to this router
// router.use(requireAuth)
productRoutes.get('/', _getProducts);
productRoutes.get('/query/random', _getRandomProducts);
productRoutes.get('/check-name/:name', _checkNameAvailable);
productRoutes.get('/by-name/:name', _getProductByName);
productRoutes.get('/by-id/:id', _getProductById);
productRoutes.post('/add/', _addProduct);
productRoutes.put('/update/:id', _updateProduct);
productRoutes.delete('/delete/:id', _removeProduct);
// product controller functions
async function _getProducts(req, res) {
    try {
        const { search, type } = req.query;
        let filterBy = { search, type };
        loggerService.debug('Filtering products by: ', filterBy);
        const products = await productService.query(filterBy);
        res.json(products);
    }
    catch (err) {
        loggerService.error('Failed to get products', err);
        res.status(500).send({ err: 'Failed to get products' });
    }
}
async function _getProductById(req, res) {
    try {
        const product = await productService.getById(req.params.id);
        res.json(product);
    }
    catch (err) {
        loggerService.error('Failed to get product', err);
        res.status(500).send({ err: 'Failed to get product' });
    }
}
async function _getProductByName(req, res) {
    try {
        const product = await productService.getByName(req.params.name);
        res.json(product);
    }
    catch (err) {
        loggerService.error('Failed to get product by name', err);
        res.status(500).send({ err: 'Failed to get product by name' });
    }
}
async function _checkNameAvailable(req, res) {
    try {
        const productName = req.params.name;
        const product = await productService.getByName(productName);
        if (product)
            loggerService.error('This product name is not available: ', product.name);
        else
            loggerService.info('This product name is available: ', productName);
        res.json({ isAvailable: !product });
    }
    catch (err) {
        loggerService.error('Error with checking availability of name', err);
        res.status(500).send({ err: 'Error with checking availability of name' });
    }
}
async function _getRandomProducts(req, res) {
    try {
        const type = req.query.type;
        const excludeProductId = req.query.excludeProductId ? new ObjectId(req.query.excludeProductId) : undefined;
        loggerService.info(`Fetching products from ${type}, excluding id: ${excludeProductId}`);
        const products = await productService.getRandomProducts(type, excludeProductId);
        loggerService.info(`Found relevant products: ${JSON.stringify(products.map(product => product._id))}`);
        res.json(products);
    }
    catch (err) {
        loggerService.error('Failed to get random products', err);
        res.status(500).send({ err: 'Failed to get random products' });
    }
}
async function _addProduct(req, res) {
    try {
        const product = req.body;
        loggerService.debug('Creating product: ', product);
        const addedProduct = await productService.save(product);
        res.json(addedProduct);
    }
    catch (err) {
        loggerService.error('Failed to add product', err);
        res.status(500).send({ err: 'Failed to add product' });
    }
}
async function _updateProduct(req, res) {
    try {
        const product = { ...req.body, _id: req.params.id };
        loggerService.debug('Updating product: ', product._id);
        const updatedProduct = await productService.save(product);
        res.json(updatedProduct);
    }
    catch (err) {
        loggerService.error('Failed to update product', err);
        res.status(500).send({ err: 'Failed to update product' });
    }
}
async function _removeProduct(req, res) {
    try {
        const productId = req.params.id;
        loggerService.debug('Removing product with _id: ', productId);
        await productService.remove(productId);
        res.status(200).send({ msg: 'Product successfully removed' });
    }
    catch (err) {
        loggerService.error('Failed to remove product', err);
        res.status(500).send({ err: 'Failed to remove product' });
    }
}
