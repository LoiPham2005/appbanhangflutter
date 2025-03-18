const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`)
    }
});

// up mỗi ảnh
// const upload = multer({ 
//     storage: storage,
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype.startsWith('image/')) {
//             cb(null, true);
//         } else {
//             cb(new Error('Not an image! Please upload only images.'), false);
//         }
//     },
//     limits: {
//         fileSize: 5 * 1024 * 1024 // 5MB
//     }
// });

// up cả ảnh và video
const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Cho phép cả image và video
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Not a media file! Please upload only images or videos.'), false);
        }
    },
    limits: {
        fileSize: 50 * 1024 * 1024 // Tăng lên 50MB cho video
    }
});

module.exports = upload;