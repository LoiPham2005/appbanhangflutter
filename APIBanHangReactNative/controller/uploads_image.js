var express = require('express');
var router = express.Router();

// Thêm cloudinary config
// const cloudinary = require('cloudinary').v2;
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

module.exports = {

    // add mỗi ảnh
    // add: (req, res) => {
    //     try {
    //         if (!req.files || req.files.length === 0) {
    //             return res.status(400).json({
    //                 status: 400,
    //                 message: 'No files uploaded'
    //             });
    //         }

    //         const imageUrls = req.files.map(file =>
    //             // `http://192.168.1.102:3000/uploads/${file.filename}`
    //             `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
    //         );

    //         res.json({
    //             status: 200,
    //             message: 'Upload success',
    //             imageUrls: imageUrls
    //         });
    //     } catch (error) {
    //         console.error('Upload error:', error);
    //         res.status(500).json({
    //             status: 500,
    //             message: 'Upload failed',
    //             error: error.message
    //         });
    //     }
    // }

    // add ảnh và video
    add: async (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    status: 400,
                    message: 'No files uploaded'
                });
            }

            const mediaUrls = req.files.map(file => ({
                type: file.mimetype.startsWith('image/') ? 'image' : 'video',
                url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
            }));

            res.json({
                status: 200,
                message: 'Upload success',
                mediaUrls: mediaUrls
            });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({
                status: 500,
                message: 'Upload failed',
                error: error.message
            });
        }
    }

    // add: async (req, res) => {
    //     try {
    //         if (!req.files || req.files.length === 0) {
    //             return res.status(400).json({
    //                 status: 400,
    //                 message: 'No files uploaded'
    //             });
    //         }

    //         const uploadPromises = req.files.map(file => {
    //             return new Promise((resolve, reject) => {
    //                 cloudinary.uploader.upload_stream(
    //                     { resource_type: "auto" },
    //                     (error, result) => {
    //                         if (error) reject(error);
    //                         else resolve({
    //                             type: file.mimetype.startsWith('image/') ? 'image' : 'video',
    //                             url: result.secure_url
    //                         });
    //                     }
    //                 ).end(file.buffer);
    //             });
    //         });

    //         const mediaUrls = await Promise.all(uploadPromises);

    //         res.json({
    //             status: 200,
    //             message: 'Upload success',
    //             mediaUrls: mediaUrls
    //         });
    //     } catch (error) {
    //         console.error('Upload error:', error);
    //         res.status(500).json({
    //             status: 500,
    //             message: 'Upload failed',
    //             error: error.message
    //         });
    //     }
    // }

}