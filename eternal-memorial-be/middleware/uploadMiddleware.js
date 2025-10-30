const multer = require('multer');
const path = require('path');

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter to allow only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG and PNG images are allowed.'), false);
    }
};

// Create multer upload instance
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 5 // Maximum 5 files per upload
    }
});

// Middleware to handle multiple image uploads
const uploadImages = upload.array('photos', 5);

// Wrapper function to handle multer errors
const uploadMiddleware = (req, res, next) => {
    uploadImages(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: 'File too large. Maximum size is 5MB'
                });
            }
            if (err.code === 'LIMIT_FILE_COUNT') {
                return res.status(400).json({
                    success: false,
                    message: 'Too many files. Maximum is 5 images'
                });
            }
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        
        next();
    });
};

module.exports = uploadMiddleware;