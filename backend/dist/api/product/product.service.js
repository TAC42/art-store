import { ObjectId } from "mongodb";
import { dbService } from "../../services/db.service.js";
import { loggerService } from "../../services/logger.service.js";
import { cloudinaryService } from "../../services/cloudinary.service.js";
const PRODUCTS_COLLECTION = 'product';
export const productService = {
    query,
    getById,
    getByName,
    save,
    remove,
    getRandomProducts,
    checkRedundantProductImages,
};
async function query(filterBy = {}) {
    try {
        const collection = await dbService.getCollection(PRODUCTS_COLLECTION);
        const pipeline = _buildPipeline(filterBy);
        return await collection.aggregate(pipeline).toArray();
    }
    catch (err) {
        loggerService.error('cannot find products', err);
        throw err;
    }
}
async function getById(productId) {
    try {
        const collection = await dbService.getCollection(PRODUCTS_COLLECTION);
        const product = await collection.findOne({ _id: new ObjectId(productId) });
        return product;
    }
    catch (err) {
        loggerService.error(`Error finding product ${productId}`, err);
        throw err;
    }
}
async function getByName(productName) {
    try {
        const collection = await dbService.getCollection(PRODUCTS_COLLECTION);
        const product = await collection.findOne({ name: { $regex: `^${productName}$`, $options: 'i' } });
        if (product)
            loggerService.info('found product: ', product);
        else
            loggerService.error('No product found with name:', productName);
        return product;
    }
    catch (err) {
        loggerService.error(`Error finding product ${productName}`, err);
        throw err;
    }
}
async function getRandomProducts(type, excludeProductId) {
    try {
        const collection = await dbService.getCollection(PRODUCTS_COLLECTION);
        const pipeline = [
            { $match: { _id: { $ne: new ObjectId(excludeProductId) }, type } },
            { $sample: { size: 3 } }
        ];
        return await collection.aggregate(pipeline).toArray();
    }
    catch (err) {
        loggerService.error('Error getting random products', err);
        throw err;
    }
}
async function save(product) {
    const collection = await dbService.getCollection(PRODUCTS_COLLECTION);
    try {
        if (product._id) {
            const { _id, ...productToUpdate } = product;
            const id = _id instanceof ObjectId ? _id : new ObjectId(_id);
            const result = await collection.updateOne({ _id: id }, { $set: productToUpdate });
            if (result.matchedCount === 0)
                throw new Error(`Product with id ${id.toHexString()} not found`);
            return product;
        }
        else {
            const response = await collection.insertOne(product);
            return { ...product, _id: response.insertedId };
        }
    }
    catch (err) {
        loggerService.error('Failed to save product', err);
        throw err;
    }
}
async function remove(productId) {
    try {
        const collection = await dbService.getCollection(PRODUCTS_COLLECTION);
        const { deletedCount } = await collection.deleteOne({ _id: new ObjectId(productId) });
        if (deletedCount === 0)
            throw new Error(`Product with id ${productId} was not found`);
        return deletedCount;
    }
    catch (err) {
        loggerService.error(`cannot remove product ${productId}`, err);
        throw err;
    }
}
function _buildPipeline(filterBy) {
    const pipeline = [];
    const criteria = { $match: {} };
    if (filterBy.search) {
        criteria.$match.$or = [
            { name: { $regex: new RegExp(filterBy.search, 'i') } },
            { description: { $regex: new RegExp(filterBy.search, 'i') } }
        ];
    }
    if (filterBy.type) {
        criteria.$match.type = { $regex: new RegExp(filterBy.type, 'i') };
    }
    pipeline.push(criteria);
    return pipeline;
}
async function checkRedundantProductImages() {
    try {
        const folders = ['Shop', 'Artware', 'Sculpture'];
        const cloudinaryImagePublicIds = await cloudinaryService.getAllCloudinaryImages(folders);
        const productImagePublicIds = await _getAllProductImages();
        const orphanedImages = cloudinaryImagePublicIds.filter((publicId) => !productImagePublicIds.includes(publicId));
        if (orphanedImages.length > 0) {
            loggerService.info('Orphaned images found: ', orphanedImages);
            loggerService.info('Total amount found: ', orphanedImages.length);
            for (const publicId of orphanedImages) {
                await cloudinaryService.deleteImageFromCloudinary(publicId);
            }
            loggerService.debug('Deletion of orphaned images completed');
        }
        else
            loggerService.info('No orphaned images found');
    }
    catch (err) {
        loggerService.error('Error checking for redundant images', err);
        throw err;
    }
}
async function _getAllProductImages() {
    try {
        const collection = await dbService.getCollection(PRODUCTS_COLLECTION);
        const products = await collection.find({}, { projection: { imgUrls: 1 } }).toArray();
        const imgUrls = products.reduce((acc, product) => {
            if (product.imgUrls)
                acc.push(...product.imgUrls);
            return acc;
        }, []);
        const resultImagePublicIds = imgUrls.map(imgUrl => cloudinaryService.extractPublicIdFromUrl(imgUrl)).filter((id) => id !== null);
        return resultImagePublicIds;
    }
    catch (err) {
        loggerService.error('Failed to get product images', err);
        throw err;
    }
}
