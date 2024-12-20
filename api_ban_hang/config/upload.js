const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()} - ${file.originalname}`)
    }
})

const upload = multer({ 
    storage: storage,
    limit:{
        fileSize: 1024 * 1024 * 5  // 5MB
    }
 });


module.exports = upload;