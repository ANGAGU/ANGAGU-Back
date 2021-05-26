import express from 'express';
import * as controller from '../controller/customer.controller';
import * as auth from '../controller/auth';

const router = express.Router();

router.post('/login', controller.login);
router.get('/products', controller.products);
router.get('/products/:productId', controller.productDetail);
router.get('/order', auth.authorization, controller.orderList);
router.get('/order/:orderId', auth.authorization, controller.orderDetail);
router.get('/products/:productId/ar', controller.modelUrl);
router.post('/signup', controller.signup);
router.post('/signup/sms/code', controller.reqVerifyCode);
router.post('/signup/sms/verification', controller.conVerifyCode);
router.post('/signup/email', controller.checkEmail);

router.get('/address', auth.authorization, controller.getAddress);
router.post('/address', auth.authorization, controller.postAddress);
router.delete('/address/:addressId', auth.authorization, controller.deleteAddress);
router.put('/address/:addressId', auth.authorization, controller.putAddress);

export default router;
