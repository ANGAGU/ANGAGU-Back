import express from 'express';
import * as controller from '../controller/customer.controller';
import * as auth from '../controller/auth';

const router = express.Router();

router.post('/login', controller.login);
router.get('/products', controller.products);
router.get('/products/:productId', controller.productDetail);
router.get('/order', auth.authorization, controller.orderList);
router.post('/order', auth.authorization, controller.postOrder);
router.get('/products/:productId/ar', controller.modelUrl);
router.post('/signup', controller.signup);
router.post('/signup/sms/code', controller.reqVerifyCode);
router.post('/signup/sms/verification', controller.conVerifyCode);
router.post('/signup/email', controller.checkEmail);
router.get('/products/:productId/board', controller.getProductBoard);
router.post('/products/:productId/board', auth.authorization, controller.postProductBoard);

router.get('/address', auth.authorization, controller.getAddress);
router.post('/address', auth.authorization, controller.postAddress);
router.delete('/address/:addressId', auth.authorization, controller.deleteAddress);
router.put('/address/:addressId', auth.authorization, controller.putAddress);
router.post('/address/default/:addressId', auth.authorization, controller.setDefaultAddress);
router.get('/address/default', auth.authorization, controller.getDefaultAddress);

router.get('/cart', auth.authorization, controller.getCart);
router.post('/cart', auth.authorization, controller.postCart);

export default router;
