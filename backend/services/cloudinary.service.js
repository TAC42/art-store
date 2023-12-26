import { loggerService } from './logger.service.js'
import * as Cloudinary from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

const cloudinary = Cloudinary.v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export const cloudinaryService = {
    getAllCloudinaryImages,
    deleteImageFromCloudinary,
    extractPublicIdFromUrl
}

async function getAllCloudinaryImages(folderName) {
    try {
        const folderPath = `Giggler/${folderName}`
        const results = await cloudinary.api.resources({
            type: 'upload',
            prefix: folderPath,
            max_results: 999
        })
        // return results.resources.map(resource => resource.url)
        return results.resources.map(resource => extractPublicIdFromUrl(resource.url))
    } catch (err) {
        loggerService.error('Failed to get all Cloudinary images', err)
        throw err
    }
}

async function deleteImageFromCloudinary(publicId) {
    try {
        await cloudinary.uploader.destroy(publicId)
    } catch (err) {
        loggerService.error('Failed to delete image from Cloudinary', err)
        throw err
    }
}

function extractPublicIdFromUrl(imageUrl) {
    // Split the URL by '/' and get the array of parts
    const urlParts = imageUrl.split('/')

    const uploadIndex = urlParts.indexOf('upload')
    const publicIdParts = urlParts.slice(uploadIndex + 2, urlParts.length)

    const publicId = publicIdParts.join('/').split('.')[0]
    return publicId
}