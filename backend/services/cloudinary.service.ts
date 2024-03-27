import dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
import { dbService } from './db.service.js'
import { loggerService } from './logger.service.js'

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const cloudinaryService = {
    checkOrphanedImages,
    _getAllCloudinaryImages,
    _deleteImageFromCloudinary,
    _extractPublicIdFromUrl,
}

async function checkOrphanedImages(collectionName: string, folders: string[]): Promise<void> {
    try {
        const cloudinaryImagePublicIds = await _getAllCloudinaryImages(folders)
        const storedImagePublicIds = await _getAllPublicIdsFromCollection(collectionName)

        const orphanImages = cloudinaryImagePublicIds.filter(
            publicId => !storedImagePublicIds.includes(publicId))

        if (orphanImages.length > 0) {
            loggerService.info('Orphaned images found: ', orphanImages)
            loggerService.info('Total amount found: ', orphanImages.length)

            for (const publicId of orphanImages) {
                await _deleteImageFromCloudinary(publicId)
            }
            loggerService.debug('Deletion of orphaned images completed')
        } else loggerService.info('No orphaned images found')
    } catch (err) {
        loggerService.error('Error checking for redundant images', err)
        throw err
    }
}

async function _getAllCloudinaryImages(folderNames: string[]): Promise<string[]> {
    let allImages: string[] = []
    try {
        for (const folderName of folderNames) {
            const folderPath = `${folderName}/`
            const results = await cloudinary.api.resources({
                type: 'upload',
                prefix: folderPath,
                max_results: 999,
            })
            allImages = allImages.concat(results.resources.map(
                (resource: any) => _extractPublicIdFromUrl(resource.url)))
        }
        return allImages
    } catch (err) {
        loggerService.error('Failed to get all Cloudinary images', err)
        throw err
    }
}

async function _getAllPublicIdsFromCollection(collectionName: string): Promise<string[]> {
    try {
        const collection = await dbService.getCollection(collectionName)
        const items = await collection.find({},
            { projection: { imgUrls: 1 } }).toArray()

        const imgUrls = items.reduce((acc: string[], item) => {
            if (item.imgUrls) acc.push(...item.imgUrls)
            return acc
        }, [])
        const resultImagePublicIds = imgUrls.map(
            imgUrl => _extractPublicIdFromUrl(imgUrl)).filter(
                (id): id is string => id !== null)

        return resultImagePublicIds
    } catch (err) {
        loggerService.error(`Failed to get images from ${collectionName}`, err)
        throw err
    }
}

async function _deleteImageFromCloudinary(publicId: string): Promise<void> {
    try {
        loggerService.info('Attempting to delete image with ID:', publicId)
        const result = await cloudinary.uploader.destroy(publicId)
        loggerService.info('Deletion result:', result)
    } catch (err) {
        loggerService.error('Failed to delete image from Cloudinary', err)
        throw err
    }
}

function _extractPublicIdFromUrl(imageUrl: string): string | null {
    if (!imageUrl) {
        loggerService.error('Received undefined or null imageUrl')
        return null
    }
    try {
        const urlParts = imageUrl.split('/')
        const uploadIndex = urlParts.indexOf('upload')
        if (uploadIndex === -1) {
            loggerService.error(`Invalid imageUrl format: ${imageUrl}`)
            return null
        }
        // Exclude the version number if present
        const publicId = urlParts.slice(uploadIndex + 2).join('/').split('.')[0]
        return publicId
    } catch (error) {
        loggerService.error(`Error extracting public ID from URL: ${imageUrl}`, error)
        return null
    }
}