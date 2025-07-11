const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục uploads nếu chưa tồn tại
const uploadsDir = path.join(__dirname, '../../uploads');
const productImagesDir = path.join(uploadsDir, 'products');
const userAvatarsDir = path.join(uploadsDir, 'avatars');

[uploadsDir, productImagesDir, userAvatarsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Cấu hình storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = uploadsDir;
    
    // Phân loại thư mục theo fieldname
    if (file.fieldname === 'productImages') {
      uploadPath = productImagesDir;
    } else if (file.fieldname === 'avatar') {
      uploadPath = userAvatarsDir;
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Tạo tên file unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
  }
});

// File filter để kiểm tra loại file
const fileFilter = (req, file, cb) => {
  // Chỉ cho phép upload hình ảnh
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép upload file hình ảnh!'), false);
  }
};

// Cấu hình multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5 // Tối đa 5 files
  }
});

// Middleware xử lý lỗi upload
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File quá lớn. Kích thước tối đa là 5MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Quá nhiều file. Tối đa 5 files.'
      });
    }
  }
  
  if (error.message === 'Chỉ cho phép upload file hình ảnh!') {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
};

module.exports = {
  upload,
  handleUploadError
};
