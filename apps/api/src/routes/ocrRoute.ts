import { Router } from 'express';
import { handleFileUpload } from '../controllers/ocrController';
import multer from 'multer';
const path = require('path');
const router = Router();
// const upload = multer({ storage: multer.memoryStorage() });
const upload = multer({ storage: multer.memoryStorage() });

router.post('/extract-text',upload.single('image'), handleFileUpload);

export default router;
