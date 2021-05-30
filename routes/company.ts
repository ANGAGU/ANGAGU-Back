import express from 'express';
import * as controller from '../controller/company.controller';
import * as auth from '../controller/auth';
import * as upload from '../controller/s3';

const router = express.Router();

router.post('/login', controller.login);

router.get('/products', auth.authorization, controller.products);
router.post('/products', auth.authorization, upload.fileUpload, controller.addProduct);

router.delete('/products/:productId', auth.authorization, controller.deleteProduct);
router.put('/products/:productId', auth.authorization, upload.fileUpload, controller.updateProductDetail);

router.post('/products/:productId/image', auth.authorization, upload.fileUpload, controller.addProductImage);
router.delete('/products/:productId/image', auth.authorization, controller.deleteProductImage);

router.post('/products/:productId/ar', auth.authorization, upload.fileUpload, controller.addProductAr);

router.get('/sale', auth.authorization, controller.sale);
router.get('/sale/product', auth.authorization, controller.saleProduct);
router.post('/info/business', auth.authorization, controller.addBusinessInfo);

router.post('/signup', controller.signup);
router.post('/signup/sms/code', controller.reqVerifyCode);
router.post('/signup/sms/verification', controller.conVerifyCode);
router.post('/signup/email', controller.checkEmail);
router.get('/info', auth.authorization, controller.getInfo);
router.post('/info', auth.authorization, controller.updateInfo);

router.get('/order', auth.authorization, controller.getOrder);
router.put('/order', auth.authorization, controller.addDeliveryNumber);

router.post('/find/code', controller.reqVerifyCode);
router.get('/find/id', controller.findId);
router.get('/find/pw', controller.findPw);
router.post('/find/verification', controller.conVerifyCode);
router.put('/find/pw', controller.updatePw);
export default router;
