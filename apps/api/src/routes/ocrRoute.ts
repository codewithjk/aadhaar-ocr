import { Router } from 'express';
import { handleFileUpload } from '../controllers/ocrController';
import multer from 'multer';
const path = require('path');
const router = Router();
// const upload = multer({ storage: multer.memoryStorage() });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // folder within your project
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname)); // preserves extension
    }
  });
  
  const upload = multer({ storage: storage });
router.post('/extract-text',upload.single('image'), handleFileUpload);

export default router;
