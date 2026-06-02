const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs').promises;

// Ensure upload directories exist
const ensureUploadDirs = async () => {
  const dirs = ['uploads', 'uploads/products', 'uploads/profiles', 'uploads/temp'];
  for (const dir of dirs) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }
};

ensureUploadDirs();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/temp/';
    
    if (file.fieldname === 'productImages') {
      uploadPath = 'uploads/products/';
    } else if (file.fieldname === 'profileImage') {
      uploadPath = 'uploads/profiles/';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WebP) are allowed'));
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Maximum 10 files
  },
  fileFilter: fileFilter
});

// Image processing middleware
const processImages = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  try {
    const processedFiles = [];

    for (const file of req.files) {
      const inputPath = file.path;
      const outputPath = inputPath.replace('temp/', '');

      // Process image with Sharp
      await sharp(inputPath)
        .resize(800, 800, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 85 })
        .toFile(outputPath);

      // Delete temporary file
      await fs.unlink(inputPath);

      // Update file path
      file.path = outputPath;
      file.filename = path.basename(outputPath);
      
      processedFiles.push({
        filename: file.filename,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype
      });
    }

    req.processedFiles = processedFiles;
    next();
  } catch (error) {
    // Clean up uploaded files on error
    if (req.files) {
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      }
    }
    
    return res.status(500).json({
      status: 'error',
      message: 'Image processing failed',
      error: error.message
    });
  }
};

// Single file upload middleware
const uploadSingle = (fieldName) => {
  return [
    upload.single(fieldName),
    processImages
  ];
};

// Multiple files upload middleware
const uploadMultiple = (fieldName, maxCount = 10) => {
  return [
    upload.array(fieldName, maxCount),
    processImages
  ];
};

// Mixed files upload middleware
const uploadMixed = (fields) => {
  return [
    upload.fields(fields),
    processImages
  ];
};

// Delete file utility
const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadMixed,
  processImages,
  deleteFile
};
