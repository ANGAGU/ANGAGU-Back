import express from 'express';
import * as controller from '../controller/customer.controller';
import * as auth from '../controller/auth';

const router = express.Router();

router.post('/login', controller.login);
router.get('/products', controller.products);
router.get('/products/:productId', controller.productDetail);
router.get('/products/:productId/ar', controller.modelUrl);

router.get('/order', auth.authorization, controller.orderList);
router.post('/order', auth.authorization, controller.postOrder);
router.post('/order/:orderId/review', auth.authorization, controller.postReview);
router.get('/order/:orderId/review', auth.authorization, controller.getReview);
router.delete('/order/:orderId/review/:reviewId', auth.authorization, controller.deleteReview);
router.put('/order/:orderId/review/:reviewId', auth.authorization, controller.updateReview);
router.post('/refund/:orderId', auth.authorization, controller.refund);

router.post('/signup', controller.signup);
router.post('/signup/sms/code', controller.reqVerifyCode);
router.post('/signup/sms/verification', controller.conVerifyCode);
router.post('/signup/email', controller.checkEmail);

router.get('/products/:productId/board', controller.getProductBoard);
router.post('/products/:productId/board', auth.authorization, controller.postProductBoard);

router.delete('/board/:boardId', auth.authorization, controller.deleteBoard);

router.get('/address', auth.authorization, controller.getAddress);
router.post('/address', auth.authorization, controller.postAddress);
router.delete('/address/:addressId', auth.authorization, controller.deleteAddress);
router.put('/address/:addressId', auth.authorization, controller.putAddress);
router.post('/address/default/:addressId', auth.authorization, controller.setDefaultAddress);
router.get('/address/default', auth.authorization, controller.getDefaultAddress);

router.post('/find/code', controller.reqVerifyCode);
router.get('/find/id', controller.findId);
router.get('/find/pw', controller.findPw);
router.post('/find/verification', controller.conVerifyCode);
router.put('/find/pw', controller.updatePw);

router.post('/info/verification', auth.authorization, controller.checkPw);
router.get('/info', auth.authorization, controller.getInfo);
router.post('/info', auth.authorization, controller.updateInfo);

router.get('/cart', auth.authorization, controller.getCart);
router.post('/cart', auth.authorization, controller.postCart);
router.delete('/cart/:cartId', auth.authorization, controller.deleteCart);

export default router;
