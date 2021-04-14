import express from 'express';
import multer from 'multer';
import * as controller from '../controller/company.controller';
import * as auth from '../controller/auth';
import { storage } from '../controller/utils';

const router = express.Router();
const upload = multer({ storage });

router.post('/login', controller.login);
router.get('/products', auth.authorization, controller.products);
router.post('/products', auth.authorization, upload.fields([{
  name: 'images', maxCount: 20,
}, {
  name: 'description_image', maxCount: 1,
}, {
  name: 'thumb_image', maxCount: 1,
}]), controller.addProduct);
router.put('/products/:productId', auth.authorization, controller.products);
router.delete('/products/:productId', auth.authorization, controller.products);

export default router;
