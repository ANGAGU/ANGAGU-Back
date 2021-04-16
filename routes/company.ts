import express from 'express';
import * as controller from '../controller/company.controller';
import * as auth from '../controller/auth';
import * as upload from '../controller/s3';

const router = express.Router();

router.post('/login', controller.login);
router.get('/products', auth.authorization, controller.products);
router.post('/products', auth.authorization, upload.fileUpload, controller.addProduct);
router.delete('/products/:productId', auth.authorization, controller.deleteProduct);
router.put('/products/:productId', auth.authorization, controller.updateProduct);

export default router;
