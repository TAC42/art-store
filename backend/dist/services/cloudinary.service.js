import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { loggerService } from './logger.service.js';
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const cloudinaryService = {
    getAllCloudinaryImages,
    deleteImageFromCloudinary,
    extractPublicIdFromUrl,
};
async function getAllCloudinaryImages(folderNames) {
    let allImages = [];
    try {
        for (const folderName of folderNames) {
            const folderPath = `${folderName}/`;
            const results = await cloudinary.api.resources({
                type: 'upload',
                prefix: folderPath,
                max_results: 999,
            });
            allImages = allImages.concat(results.resources.map((resource) => extractPublicIdFromUrl(resource.url)));
        }
        return allImages;
    }
    catch (err) {
        loggerService.error('Failed to get all Cloudinary images', err);
        throw err;
    }
}
async function deleteImageFromCloudinary(publicId) {
    try {
        loggerService.info('Attempting to delete image with ID:', publicId);
        const result = await cloudinary.uploader.destroy(publicId);
        loggerService.info('Deletion result:', result);
    }
    catch (err) {
        loggerService.error('Failed to delete image from Cloudinary', err);
        throw err;
    }
}
function extractPublicIdFromUrl(imageUrl) {
    if (!imageUrl) {
        loggerService.error('Received undefined or null imageUrl');
        return null;
    }
    try {
        const urlParts = imageUrl.split('/');
        const uploadIndex = urlParts.indexOf('upload');
        if (uploadIndex === -1) {
            loggerService.error(`Invalid imageUrl format: ${imageUrl}`);
            return null;
        }
        // Exclude the version number if present
        const publicId = urlParts.slice(uploadIndex + 2).join('/').split('.')[0];
        return publicId;
    }
    catch (error) {
        loggerService.error(`Error extracting public ID from URL: ${imageUrl}`, error);
        return null;
    }
}
