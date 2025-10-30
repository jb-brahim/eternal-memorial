const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    disable_time_validation: true // Prevent timestamp validation errors
});

// Upload image to Cloudinary or local storage
const uploadImage = async (file) => {
    try {
        // In development, store files locally
        if (process.env.NODE_ENV === 'development') {
            const fs = require('fs').promises;
            const path = require('path');
            
            // Create uploads directory if it doesn't exist
            const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
            await fs.mkdir(uploadDir, { recursive: true });

            const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
            const filePath = path.join(uploadDir, fileName);
            
            await fs.writeFile(filePath, file.buffer);
            return `/uploads/${fileName}`;
        }

        // In production, use Cloudinary
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'eternal-memories',
            resource_type: 'auto'
        });

        return result.secure_url;
    } catch (error) {
        console.error('Image upload failed:', error);
        throw new Error('Failed to upload image');
    }
};

// Delete image from Cloudinary
const deleteImage = async (imageUrl) => {
    try {
        if (!process.env.CLOUDINARY_CLOUD_NAME) {
            // Handle local storage deletion
            return;
        }

        const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Image deletion failed:', error);
    }
};

// Get full image URL based on environment
const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL (from Cloudinary), return as is
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    
    // For local development
    if (process.env.NODE_ENV === 'development') {
        return `${process.env.BASE_URL || 'http://localhost:3000'}${imagePath}`;
    }
    
    return imagePath;
};

module.exports = {
    uploadImage,
    deleteImage,
    getImageUrl
};