const multer = require('multer');
const path = require('path');

const tmpPath = path.join(__dirname, '../tmp')

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tmpPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
})

const upload = multer({ 
    storage: storageConfig,
    fileFilter: function fileFilter (req, file, cb){
        if (file.mimetype.includes('image')) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    },
    limits: {
        fieldNameSize: 100,
        fileSize: 5
    },
})

module.exports = {
    upload
};